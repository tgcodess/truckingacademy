import React, { useEffect, useState } from 'react';
import { APISERVICES } from '@/api-services';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardActions, CardContent, CardHeader, MenuItem, StepConnector, TextField } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Editor } from '@tiptap/react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { paths } from '@/paths';
import { convertToFormData } from '@/lib/convert-form-data';
import { FileDropzone } from '@/components/core/file-dropzone';
import Loader from '@/components/core/loader';
import { TextEditor } from '@/components/core/text-editor/text-editor';

const courseSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  duration: z.string().refine((val) => /^\d+(days|weeks|months)$/.test(val), {
    message: "Duration must be in the format 'Xd', 'Xweeks', or 'Xmonths' where X is a number",
  }),
  status: z.enum(['draft', 'published', 'archived'], {
    message: "Status must be either 'draft', 'published', or 'archived'",
  }),
  passing_criteria: z.number().min(85).max(100, {
    message: 'Passing Criteria must be a percentage between 0 and 100',
  }),
  chapters: z.number().min(1, { message: 'Chapters must be an array of numbers with at least one chapter' }),
  price: z.number().positive({ message: 'Price must be a positive number' }),
  language: z.string().min(1, { message: 'Language is required' }),
  course_endorsement_code: z
    .string()
    .min(1, { message: 'Course Endorsement Code is required' })
    .refine((val) => /^[a-zA-Z0-9]+$/.test(val), {
      message: 'Course Endorsement Code must only contain letters and numbers',
    }),
  // course_type: z.enum(['new', 'recurring'], { message: "Course Type must be either 'new' or 'recurring'" }),
  description: z.string().min(1, { message: 'Description is required' }),
  course_instruction: z.string().min(1, { message: 'Course Instruction is required' }),
  training_type: z.string().min(1, { message: 'Training Type is required' }),
  training_method: z.string().min(1, { message: 'Training Method is required' }),
  cover_image: z.unknown(),
});

type Values = z.infer<typeof courseSchema>;

const defaultValues = {
  title: '',
  duration: '',
  status: 'draft',
  passing_criteria: 85,
  chapters: 1,
  price: 0,
  language: '',
  course_endorsement_code: 'A',
  // course_type: 'new',
  description: '',
  course_instruction: '',
  cover_image: '',
  training_type: 'New',
  training_method: 'Theory',
} satisfies Values;

const renderBackgroundImage = (fieldValue: any) => {
  if (fieldValue instanceof File) {
    return `url(${URL.createObjectURL(fieldValue)})`;
  } else {
    return `url(${fieldValue})`;
  }
};

function Settings({ edit = false, courseId = '' }: { edit?: boolean; courseId?: string }) {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(courseSchema) });

  const [goBack, setGoBack] = useState(false);
  const queryInvalidate = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (values: Values) => {
      const res = edit
        ? await APISERVICES.courses.post(convertToFormData(values), courseId)
        : await APISERVICES.courses.post(convertToFormData(values));
      return res;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryInvalidate.invalidateQueries({
        queryKey: ['courses_list'],
      });
      if (goBack) {
        navigate({ to: paths.dashboard.courses.list });
      } else {
        if (!edit) {
          navigate({ to: paths.dashboard.courses.edit(data?.data?.id) });
        }
      }
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
      console.log('error', error);
    },
  });

  const { data, isLoading, error } = useQuery({
    enabled: courseId ? true : false,
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data } = await APISERVICES.courses.get(courseId);
      return data;
    },
  });

  useEffect(() => {
    if (edit && courseId && data) {
      setValue('title', data?.title);
      setValue('duration', data?.duration);
      setValue('status', data?.status);
      setValue('passing_criteria', parseFloat(data?.passing_criteria));
      setValue('chapters', parseFloat(data?.chapters));
      setValue('price', parseFloat(data?.price));
      setValue('language', data?.language);
      setValue('course_endorsement_code', data?.course_endorsement_code);
      // setValue('course_type', data?.course_type);
      setValue('description', data?.description);
      setValue('course_instruction', data?.course_instruction);
      setValue('cover_image', data?.cover_image);
    }
  }, [data, edit, courseId]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Stack spacing={4} p={2}>
        <Card>
          <CardHeader title="Basic Details" />
          <CardContent>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    helperText={error?.message}
                    error={Boolean(error?.message)}
                    label="Course Title"
                    fullWidth
                  />
                )}
              />
              <Stack direction={'row'} spacing={2}>
                <Controller
                  control={control}
                  name="price"
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      value={`${field?.value}`}
                      onChange={(event) => {
                        field?.onChange?.(
                          !isNaN(parseFloat(event?.target.value)) ? parseFloat(event?.target.value) : ''
                        );
                      }}
                      helperText={error?.message}
                      error={Boolean(error?.message)}
                      label="Course Price"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="chapters"
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      value={`${field?.value}`}
                      onChange={(event) => {
                        field?.onChange?.(
                          !isNaN(parseFloat(event?.target.value)) ? parseFloat(event?.target.value) : ''
                        );
                      }}
                      helperText={error?.message}
                      error={Boolean(error?.message)}
                      label="Course Chapters"
                      fullWidth
                    />
                  )}
                />
              </Stack>
              <Stack direction={'row'} spacing={2}>
                <Controller
                  control={control}
                  name="passing_criteria"
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      value={`${field?.value}`}
                      onChange={(event) => {
                        field?.onChange?.(
                          !isNaN(parseFloat(event?.target.value)) ? parseFloat(event?.target.value) : ''
                        );
                      }}
                      helperText={error?.message}
                      error={Boolean(error?.message)}
                      label="Passing Criteria"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="language"
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      helperText={error?.message}
                      error={Boolean(error?.message)}
                      label="Language"
                      select
                      fullWidth
                    >
                      <MenuItem value="english">English</MenuItem>
                      <MenuItem value="spanish">Spanish</MenuItem>
                    </TextField>
                  )}
                />
              </Stack>
              <Stack direction={'row'} spacing={2}>
                <Controller
                  control={control}
                  name="course_endorsement_code"
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      helperText={error?.message}
                      error={Boolean(error?.message)}
                      label="Course Endorsement Code"
                      fullWidth
                      select
                    >
                      <MenuItem value="A">A</MenuItem>
                      <MenuItem value="B">B</MenuItem>
                      <MenuItem value="P">P</MenuItem>
                      <MenuItem value="H">H</MenuItem>
                    </TextField>
                  )}
                />
                <Controller
                  control={control}
                  name="duration"
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      helperText={error?.message}
                      error={Boolean(error?.message)}
                      label="Duration"
                      fullWidth
                    />
                  )}
                />
              </Stack>
              <Stack direction={'row'} spacing={2}>
                <Controller
                  control={control}
                  name="training_type"
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      helperText={error?.message}
                      error={Boolean(error?.message)}
                      label="Training Type"
                      fullWidth
                      select
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Upgrade">Upgrade</MenuItem>
                    </TextField>
                  )}
                />
                <Controller
                  control={control}
                  name="training_method"
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      helperText={error?.message}
                      error={Boolean(error?.message)}
                      label="Training Method"
                      fullWidth
                      select
                    >
                      <MenuItem value="Theory">Theory</MenuItem>
                      <MenuItem value="publicRoad">Public Road</MenuItem>
                    </TextField>
                  )}
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Upload Cover Image" />
          <CardContent>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="cover_image"
                render={({ field, fieldState: { error } }) => (
                  <>
                    {field?.value ? (
                      <Box
                        sx={{
                          backgroundImage: renderBackgroundImage(field.value),
                          backgroundPosition: 'center',
                          backgroundSize: 'cover',
                          objectFit: 'contains',
                          borderRadius: 1,
                          height: '200px',
                        }}
                      />
                    ) : (
                      <FileDropzone
                        accept={{ 'image/*': [] }}
                        maxFiles={1}
                        onDrop={([file]) => {
                          field?.onChange(file);
                        }}
                      />
                    )}
                  </>
                )}
              />
            </Stack>
          </CardContent>
          <CardActions>
            <Button
              onClick={() => {
                setValue('cover_image', '');
              }}
            >
              Remove Image
            </Button>
          </CardActions>
        </Card>

        <Card>
          <CardHeader title="Course brief description" />
          <CardContent>
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState: { error } }) => {
                return <TextEditor {...field} />;
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Instruction" />
          <CardContent>
            <Controller
              control={control}
              name="course_instruction"
              render={({ field, fieldState: { error } }) => {
                return <TextEditor {...field} />;
              }}
            />
          </CardContent>
        </Card>

        <Stack justifyContent={'center'} direction={'row'}>
          {!edit ? (
            <>
              <Stack spacing={2} justifyContent={'space-between'} direction={{ xs: 'column', md: 'row' }}>
                <Button
                  sx={{
                    minWidth: 200,
                  }}
                  variant="outlined"
                  onClick={handleSubmit((values) => {
                    setGoBack(true);
                    mutate(values);
                  })}
                >
                  Save and Close
                </Button>
                <Button
                  sx={{
                    minWidth: 200,
                  }}
                  variant="contained"
                  //@ts-ignore
                  onClick={handleSubmit(mutate)}
                >
                  Save and Continue
                </Button>
              </Stack>
            </>
          ) : (
            <Button
              sx={{
                minWidth: 280,
              }}
              variant="contained"
              color="primary"
              //@ts-ignore
              onClick={handleSubmit(mutate)}
            >
              Save
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
}

export default Settings;
