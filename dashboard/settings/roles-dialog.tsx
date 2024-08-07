import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const permission = z.array({
  //@ts-ignore
  label: z.string(),
  value: z.boolean(),
});
const schema = z.object({
  role: z.string().min(1, { message: 'Role is required' }),
  modules: z.array({
    //@ts-ignore
    name: z.string().min(1, { message: 'Module is required' }),
    permissions: permission,
  }),
});

type Values = z.infer<typeof schema>;
type permissionValues = z.infer<typeof permission>;

const defaultValues = {
  role: 'Admin',
  modules: [
    {
      name: 'User Management',
      permissions: [
        { label: 'Add', value: false },
        { label: 'Edit', value: false },
        { label: 'View', value: false },
        { label: 'Delete', value: false },
      ],
    },
    {
      name: 'Content Management',
      permissions: [
        { label: 'Add', value: false },
        { label: 'Edit', value: false },
        { label: 'View', value: false },
        { label: 'Delete', value: false },
      ],
    },
    {
      name: 'Reports',
      permissions: [
        { label: 'Add', value: false },
        { label: 'Edit', value: false },
        { label: 'View', value: false },
        { label: 'Delete', value: false },
      ],
    },
    {
      name: 'Email',
      permissions: [
        { label: 'Add', value: false },
        { label: 'Edit', value: false },
        { label: 'View', value: false },
        { label: 'Delete', value: false },
      ],
    },
  ],
} satisfies Values;

export const RolesDialog = ({ open, onClose, onSuccess, isEdit, roleId }: any) => {
  const [allRolesData, setAllRolesData] = useState(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const { append, fields: allModulesData } = useFieldArray({
    control,
    name: 'modules',
  });
  const fetchConstantData = async () => {
    try {
      if (!isEdit) {
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchConstantData();
  }, []);

  const fillRoleInformation = async () => {
    try {
    } catch (error) {}
  };
  useEffect(() => {
    if (isEdit) {
      fillRoleInformation();
    }
  }, [roleId]);

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle sx={{}}>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <>{isEdit ? 'Edit Role' : 'Add New Role'}</>
          <IconButton onClick={onClose}>
            <SvgIcon>
              <X />
            </SvgIcon>
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <Stack mt={1}>
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} fullWidth label="Role" error={!!error?.message} helperText={error?.message} />
            )}
          />

          {allModulesData.map((module, moduleIndex) => (
            <Stack
              mt={3}
              spacing={1}
              p={1.6}
              borderRadius={2}
              sx={{
                backgroundColor: 'var(--mui-palette-action-hover)',
              }}
            >
              <Controller
                name={`modules.${moduleIndex}.name`}
                control={control}
                render={({ field }) => <Typography fontWeight={'bold'}>{field?.value}</Typography>}
              />
              <Stack direction="row" gap={2} flexWrap={'wrap'}>
                {module.permissions.map((permission: permissionValues, permissionIndex: number) => (
                  <FormControlLabel
                    key={permissionIndex}
                    //@ts-ignore
                    label={permission?.label as string}
                    control={
                      <Controller
                        name={`modules.${moduleIndex}.permissions.${permissionIndex}.value`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            //@ts-ignore
                            checked={field.value === (permission?.value as boolean)}
                            onChange={(e) => {
                              field.onChange(!e.target.checked);
                            }}
                          />
                        )}
                      />
                    }
                  />
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
        <Stack justifyContent={'flex-end'} spacing={2} direction={'row'} mt={4}>
          <Button size="small" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(() => {})} variant="contained" size="small">
            {isEdit ? 'Save' : 'Add Role'}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
