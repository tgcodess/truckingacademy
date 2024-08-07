import React, { useEffect, useState } from 'react';
import { APISERVICES } from '@/api-services';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  StepConnector,
  SvgIcon,
  TextField,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Editor } from '@tiptap/react';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { paths } from '@/paths';
import { convertToFormData } from '@/lib/convert-form-data';
import { useDialog } from '@/hooks/use-dialog';
import { CustomMobileDatePicker } from '@/components/core/date-time-picker';
import { FileDropzone } from '@/components/core/file-dropzone';
import Loader from '@/components/core/loader';
import { TextEditor } from '@/components/core/text-editor/text-editor';

const studentSchema = z.object({
  first_name: z.string().min(1, { message: 'Full Name is required' }),
  last_name: z.string().min(1, { message: 'Full Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone_number: z.string().refine((val) => /^\d+$/.test(val), { message: 'Phone Number must be numeric' }),
  license_number: z.string().min(1, { message: 'License Number is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date of birth' }),
});

type StudentValues = z.infer<typeof studentSchema>;

const defaultValues: StudentValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  license_number: '',
  state: '',
  dob: '',
};

export function AddEditStudentForm({
  edit = false,
  id = '',
  onSuccess = () => {},
}: {
  edit?: boolean;
  id?: string;
  onSuccess?: any;
}) {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudentValues>({ defaultValues, resolver: zodResolver(studentSchema) });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (values: StudentValues) => {
      values.dob = dayjs(values.dob)?.format('YYYY-MM-DD');
      const res = edit ? await APISERVICES.students.put(id, values) : await APISERVICES.students.post(values);
      return res;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ['student_list'] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });

  const { data, isLoading } = useQuery({
    enabled: !!id,
    queryKey: ['student', id],
    queryFn: async () => {
      const { data } = await APISERVICES.students.get(id);
      return data;
    },
  });

  useEffect(() => {
    if (edit && id && data) {
      setValue('first_name', data?.first_name);
      setValue('last_name', data?.last_name);
      setValue('email', data?.email);
      setValue('phone_number', data?.phone_number);
      setValue('license_number', data?.license_number);
      setValue('state', data?.state);
      setValue('dob', data?.dob);
    }
  }, [data, edit, id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Stack spacing={4} p={2}>
      <CardContent>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="first_name"
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="First Name" fullWidth error={!!error?.message} helperText={error?.message} />
            )}
          />
          <Controller
            control={control}
            name="last_name"
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="Last Name" fullWidth error={!!error?.message} helperText={error?.message} />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="Email" fullWidth error={!!error?.message} helperText={error?.message} />
            )}
          />
          <Controller
            control={control}
            name="phone_number"
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Phone Number"
                fullWidth
                error={!!error?.message}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="license_number"
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="License Number"
                fullWidth
                error={!!error?.message}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="state"
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="State" fullWidth error={!!error?.message} helperText={error?.message} />
            )}
          />
          <Controller
            control={control}
            name="dob"
            render={({ field, fieldState: { error } }) => (
              <CustomMobileDatePicker
                {...field}
                value={field?.value}
                onChange={field?.onChange}
                label="Date of Birth "
                fullWidth
                error={!!error?.message}
                helperText={error?.message}
                disableFuture
              />
            )}
          />
        </Stack>
      </CardContent>

      <Stack justifyContent="center" direction="row">
        <Button
          sx={{ minWidth: 280 }}
          variant="contained"
          color="primary"
          //@ts-ignore
          onClick={handleSubmit(mutate)}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
}

export function AddEditStudent({ edit = false, id = '', button = '' }: { edit?: boolean; id?: string; button?: any }) {
  const dialog = useDialog();

  return (
    <>
      <ButtonBase
        onClick={dialog.handleOpen}
        sx={{ display: 'flex', justifyContent: 'flex-end', textDecoration: 'none', width: '100%' }}
      >
        {button ? (
          <>{button}</>
        ) : (
          <Button startIcon={<Plus />} variant="contained">
            Add
          </Button>
        )}
      </ButtonBase>

      <Dialog open={dialog?.open} maxWidth={'sm'} fullWidth onClose={dialog.handleClose}>
        <DialogTitle>
          <Stack justifyContent="space-between" direction="row" alignItems="center">
            {edit ? 'Update Student' : 'Add Student'}
            <IconButton onClick={dialog.handleClose}>
              <SvgIcon>
                <X />
              </SvgIcon>
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <AddEditStudentForm onSuccess={dialog.handleClose} edit={edit} id={id} />
        </DialogContent>
      </Dialog>
    </>
  );
}
