import React, { useMemo } from 'react';
import { APISERVICES } from '@/api-services';
import {
  Avatar,
  Card,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Box, Container, Stack } from '@mui/system';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { User } from '@phosphor-icons/react/dist/ssr/User';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSearchParams } from '@/hooks/user-searchparams';
import ApiError from '@/components/core/api-error';
import Loader from '@/components/core/loader';
import { Scrollbar } from '@/components/core/scrollbar';

function Students({ edit = false, courseId = '' }: { edit?: boolean; courseId?: string }) {
  const { searchParams, setSearchParams } = useSearchParams();
  const query = searchParams?.get('query') || '';

  const data = [
    {
      name: 'John Doe',
      email: 'johndoe@example.com',
      licence_no: 'AB1234567',
      grade: '85%',
      state: 'California',
    },
    {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      licence_no: 'CD8901234',
      grade: '90%',
      state: 'Texas',
    },
    {
      name: 'Alice Johnson',
      email: 'alicejohnson@example.com',
      licence_no: 'EF5678901',
      grade: '78%',
      state: 'New York',
    },
    {
      name: 'Bob Brown',
      email: 'bobbrown@example.com',
      licence_no: 'GH2345678',
      grade: '92%',
      state: 'Florida',
    },
    {
      name: 'Charlie Davis',
      email: 'charliedavis@example.com',
      licence_no: 'IJ3456789',
      grade: '88%',
      state: 'Illinois',
    },
  ];

  const { isLoading, error } = useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const response = await APISERVICES.instructor.get();
      const res = await APISERVICES.instructor.get('?is_active=1');
      return [...response?.data, ...res?.data];
    },
  });

  const queryClient = useQueryClient();

  const visibleRows = useMemo(
    () =>
      data?.filter((item: any) => {
        if (query) {
          const lowerCaseQuery = query.toLowerCase();

          const itemNameMatches = item.name?.toLowerCase().includes(lowerCaseQuery) || false;
          const itemPhoneMatches = item.mobileno?.toLowerCase().includes(lowerCaseQuery) || false;
          const itemEmailMatches = item.email?.toLowerCase().includes(lowerCaseQuery) || false;

          if (itemNameMatches || itemPhoneMatches || itemEmailMatches) {
            return true;
          } else {
            return false;
          }
        }

        return true;
      }),
    [query, data]
  );

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
        }}
      >
        <Container maxWidth={'xl'}>
          <Stack spacing={2}>
            <Stack direction={{ md: 'row' }} justifyContent="space-between" spacing={4}>
              <OutlinedInput
                fullWidth
                value={query}
                onChange={(e) => setSearchParams('query', e?.target?.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <SvgIcon>
                      <MagnifyingGlass />
                    </SvgIcon>
                  </InputAdornment>
                }
                placeholder="Search..."
              />
            </Stack>
            <Stack>
              <Card>
                {isLoading ? (
                  <Loader />
                ) : (
                  <>
                    {!error ? (
                      <ApiError error={error} />
                    ) : (
                      <>
                        {visibleRows?.length ? (
                          <Scrollbar>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell sortDirection="desc">Name</TableCell>
                                  <TableCell>Email</TableCell>
                                  <TableCell>Grade</TableCell>
                                  <TableCell>State</TableCell>
                                  <TableCell>License Number</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {(visibleRows || [])?.map((item: any, index: number) => {
                                  return (
                                    <TableRow hover key={item.id}>
                                      <TableCell>
                                        <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                          <Avatar
                                            sx={{
                                              height: 44,
                                              width: 44,
                                            }}
                                            src={item?.user_image}
                                          >
                                            <SvgIcon>
                                              <User />
                                            </SvgIcon>
                                          </Avatar>
                                          <Typography>{item?.name || '--'}</Typography>
                                        </Stack>
                                      </TableCell>
                                      <TableCell>{item?.email || '--'}</TableCell>
                                      <TableCell>{item?.grade || '--'}</TableCell>
                                      <TableCell>{item?.state || '--'}</TableCell>
                                      <TableCell>{item?.licence_no || '--'}</TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Scrollbar>
                        ) : (
                          <Box py={6}>
                            <Typography
                              sx={{
                                textAlign: 'center',
                              }}
                            >
                              {query ? 'No record exists for the searched phrase' : 'No Result Found'}
                            </Typography>
                          </Box>
                        )}
                      </>
                    )}
                  </>
                )}
              </Card>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Students;
