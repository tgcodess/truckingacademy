'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';
import { Trash } from '@phosphor-icons/react/dist/ssr/Trash';
import { useNavigate } from '@tanstack/react-router';
import { MuiTelInput } from 'mui-tel-input';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { RouterLink } from '@/components/core/link';
import { Option } from '@/components/core/option';
import { toast } from '@/components/core/toaster';

function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Error converting file to base64'));
    };
  });
}

const schema = zod.object({
  avatar: zod.string().optional(),
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().min(1, { message: 'Last name is required' }),
  email: zod.string().email('Must be a valid email').min(1, 'Email is required').max(255),
  phone: zod.string().min(1, 'Phone is required').max(15),
  company: zod.string().max(255),
  billingAddress: zod.object({
    country: zod.string().min(1, 'Country is required').max(255),
    state: zod.string().min(1, 'State is required').max(255),
    city: zod.string().min(1, 'City is required').max(255),
    zipCode: zod.string().min(1, 'Zip code is required').max(255),
    line1: zod.string().min(1, 'Street line 1 is required').max(255),
    line2: zod.string().max(255).optional(),
  }),
  taxId: zod.string().max(255).optional(),
  timezone: zod.string().min(1, 'Timezone is required').max(255),
  language: zod.string().min(1, 'Language is required').max(255),
  currency: zod.string().min(1, 'Currency is required').max(255),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  avatar: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '+91',
  company: '',
  billingAddress: { country: '', state: '', city: '', zipCode: '', line1: '', line2: '' },
  taxId: '',
  timezone: 'new_york',
  language: 'en',
  currency: 'USD',
} satisfies Values;

export function CustomerCreateForm(): React.JSX.Element {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (_: Values): Promise<void> => {
      try {
        // Make API request
        toast.success('Customer updated');
        navigate({ to: paths.dashboard.customers.details('1') });
      } catch (err) {
        logger.error(err);
        toast.error('Something went wrong!');
      }
    },
    [navigate]
  );

  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const avatar = watch('avatar');

  const handleAvatarChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        const url = await fileToBase64(file);
        setValue('avatar', url);
      }
    },
    [setValue]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={3}>
              <Typography variant="h6">Account information</Typography>
              <Grid container spacing={3}>
                <Grid xs={12}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Box
                      sx={{
                        border: '1px dashed var(--mui-palette-divider)',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        p: '4px',
                      }}
                    >
                      <Box sx={{ borderRadius: 'inherit', position: 'relative' }}>
                        <Box
                          sx={{
                            alignItems: 'center',
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: 'inherit',
                            bottom: 0,
                            color: 'var(--mui-palette-common-white)',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            left: 0,
                            opacity: 0,
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            zIndex: 1,
                            '&:hover': { opacity: 1 },
                          }}
                          onClick={() => {
                            if (avatar) {
                              setValue('avatar', '');
                            } else {
                              avatarInputRef.current?.click();
                            }
                          }}
                        >
                          {avatar ? (
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                              <Trash fontSize="var(--icon-fontSize-md)" />
                              <Typography color="palette.error.dark" variant="subtitle2">
                                Remove
                              </Typography>
                            </Stack>
                          ) : (
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                              <CameraIcon fontSize="var(--icon-fontSize-md)" />
                              <Typography color="inherit" variant="subtitle2">
                                Select
                              </Typography>
                            </Stack>
                          )}
                        </Box>
                        <input hidden onChange={handleAvatarChange} ref={avatarInputRef} type="file" />
                        <Avatar src={avatar || '/assets/avatar.png'} sx={{ '--Avatar-size': '100px' }} />
                      </Box>
                    </Box>
                    <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
                      <Typography variant="subtitle1">Avatar</Typography>
                      <Typography variant="caption">Min 400x400px, PNG or JPEG</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        helperText={error?.message}
                        error={Boolean(error?.message)}
                        label="First Name"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        helperText={error?.message}
                        error={Boolean(error?.message)}
                        label="Last Name"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        helperText={error?.message}
                        error={Boolean(error?.message)}
                        label="Email Address"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field, fieldState: { error } }) => (
                      <MuiTelInput
                        {...field}
                        helperText={error?.message}
                        error={Boolean(error?.message)}
                        label="Phone Number"
                        inputMode="tel"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
            <Stack spacing={3}>
              <Typography variant="h6">Billing information</Typography>
              <Grid container spacing={3}>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="billingAddress.country"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        helperText={error?.message}
                        error={Boolean(error?.message)}
                        select
                        label={'Country'}
                        fullWidth
                      >
                        <Option value="us">United States</Option>
                        <Option value="de">Germany</Option>
                        <Option value="es">Spain</Option>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="billingAddress.state"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        helperText={error?.message}
                        error={Boolean(error?.message)}
                        label="State"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="billingAddress.city"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        helperText={error?.message}
                        error={Boolean(error?.message)}
                        label="City"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="billingAddress.zipCode"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        helperText={error?.message}
                        error={Boolean(error?.message)}
                        label="Postal Code"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="billingAddress.line1"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        helperText={error?.message}
                        error={Boolean(error?.message)}
                        label="Address"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="taxId"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        helperText={error?.message}
                        error={Boolean(error?.message)}
                        label="Tax ID"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
            <Stack spacing={3}>
              <Typography variant="h6">Shipping information</Typography>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Same as billing address" />
            </Stack>
            <Stack spacing={3}>
              <Typography variant="h6">Additional information</Typography>
              <Grid container spacing={3}>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="timezone"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        helperText={error?.message}
                        error={Boolean(error?.message)}
                        select
                        label="Timezone"
                        fullWidth
                      >
                        <Option value="new_york">US - New York</Option>
                        <Option value="california">US - California</Option>
                        <Option value="london">UK - London</Option>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="language"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        helperText={error?.message}
                        error={Boolean(error?.message)}
                        select
                        label="Language"
                        fullWidth
                      >
                        <Option value="en">English</Option>
                        <Option value="es">Spanish</Option>
                        <Option value="de">German</Option>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="currency"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        helperText={error?.message}
                        error={Boolean(error?.message)}
                        select
                        label="Currency"
                        fullWidth
                      >
                        <Option value="USD">USD</Option>
                        <Option value="EUR">EUR</Option>
                        <Option value="RON">RON</Option>
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.customers.list}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Create customer
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
