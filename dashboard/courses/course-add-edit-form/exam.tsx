import React, { useMemo } from 'react';
import { APISERVICES } from '@/api-services';
import {
  Avatar,
  Card,
  IconButton,
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
import { DotsThree } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { User } from '@phosphor-icons/react/dist/ssr/User';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

import { useSearchParams } from '@/hooks/user-searchparams';
import ApiError from '@/components/core/api-error';
import Loader from '@/components/core/loader';
import { PopoverButton } from '@/components/core/popover-button';
import { Scrollbar } from '@/components/core/scrollbar';

function Students({ edit = false, courseId = '' }: { edit?: boolean; courseId?: string }) {
  const { searchParams, setSearchParams } = useSearchParams();
  const query = searchParams?.get('query') || '';

  // const data = [
  //   {
  //     exam_name: 'Math Final',
  //     unit_name: 'Algebra',
  //     passing_criteria: '60%',
  //     total_questions: 50,
  //   },
  //   {
  //     exam_name: 'Science Midterm',
  //     unit_name: 'Biology',
  //     passing_criteria: '65%',
  //     total_questions: 40,
  //   },
  //   {
  //     exam_name: 'History Quiz',
  //     unit_name: 'World War II',
  //     passing_criteria: '70%',
  //     total_questions: 30,
  //   },
  //   {
  //     exam_name: 'English Test',
  //     unit_name: 'Grammar',
  //     passing_criteria: '75%',
  //     total_questions: 20,
  //   },
  //   {
  //     exam_name: 'Physics Assessment',
  //     unit_name: 'Mechanics',
  //     passing_criteria: '80%',
  //     total_questions: 25,
  //   },
  // ];
  const { data, isLoading, error } = useQuery({
    queryKey: ['exam_list_', courseId],
    queryFn: async () => {
      //@ts-ignore
      const response = await APISERVICES.allExamsByCourseId.get(courseId);
      return response?.course?.exams || [];
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
                    {error ? (
                      <ApiError error={error} />
                    ) : (
                      <>
                        {visibleRows?.length ? (
                          <Scrollbar>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell sortDirection="desc">Exam Name</TableCell>
                                  <TableCell>Unit Name</TableCell>
                                  <TableCell>Passing Criteria</TableCell>
                                  <TableCell>Total Question</TableCell>
                                  <TableCell>Action</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {(visibleRows || [])?.map((item: any, index: number) => {
                                  return (
                                    <TableRow hover key={item.id}>
                                      <TableCell>
                                        <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                          <Typography>{item?.exam_name || '--'}</Typography>
                                        </Stack>
                                      </TableCell>
                                      <TableCell>{item?.unit_name || '--'}</TableCell>
                                      <TableCell>{item?.passing_criteria || '--'}</TableCell>
                                      <TableCell>{item?.total_questions || '--'}</TableCell>
                                      <TableCell align="right">
                                        <IconButton>
                                          <PopoverButton
                                            button={
                                              <SvgIcon>
                                                <DotsThree weight="bold" />
                                              </SvgIcon>
                                            }
                                          >
                                            <Stack></Stack>
                                          </PopoverButton>
                                        </IconButton>
                                      </TableCell>
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
