import React from 'react';
import { APISERVICES } from '@/api-services';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

import { useSearchParams } from '@/hooks/user-searchparams';
import Loader from '@/components/core/loader';
import { Scrollbar } from '@/components/core/scrollbar';

function CoursePreviewQuiz() {
  const { preViewCourseId } = useParams({ strict: false });
  const { searchParams, setSearchParams } = useSearchParams();
  const quiz = searchParams.get('quiz') || '';
  const unit = searchParams.get('unit') || '';

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['course_quiz_', quiz],
    queryFn: async () => {
      const { data } = await APISERVICES.coursesUnitQuiz.get(quiz);
      return data;
    },
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Box sx={{ position: 'relative' }}>
            <Typography
              sx={{
                position: 'absolute',
                zIndex: 100,
                top: -55,
                left: 40,
                right: 0,
                display: 'flex',
              }}
              variant="h6"
            >
              {data?.title}
            </Typography>

            <Box sx={{ height: '100%' }}>
              <Stack
                mb={2}
                direction={'row'}
                justifyContent={{
                  lg: 'flex-start',
                  xs: 'flex-end',
                }}
                alignContent="flex-end"
                alignItems={'flex-end'}
              >
                {data?.questions && (
                  <Stack spacing={1} direction={'row'} alignItems={'center'} alignContent={'flex-end'}>
                    <Typography variant="body2">Total No. of questions : </Typography>
                    <Typography variant="subtitle1">{data?.questions?.length}</Typography>
                  </Stack>
                )}
              </Stack>

              <Stack alignSelf={'center'} p={3} px={3} spacing={8} alignContent={'center'} justifyContent={'center'}>
                {data?.questions && (
                  <>
                    {data?.questions?.map((question: any, qIndex: number) => {
                      return (
                        <Stack spacing={2}>
                          <Typography variant="h6">
                            Q{qIndex + 1}. {question.question}
                          </Typography>
                          <RadioGroup
                            sx={{
                              maxWidth: 600,

                              '& .MuiFormControlLabel-root': {
                                border: '0.1px solid var(--mui-palette-divider)',
                                backgroundColor: 'var(--mui-palette-divider)',
                                borderRadius: 1,
                                gap: 2,
                                p: 1.6,
                              },
                            }}
                          >
                            {question.options.map((option: any) => (
                              <FormControlLabel
                                control={<Radio />}
                                key={option.text}
                                label={<Typography variant="inherit">{option.text}</Typography>}
                                value={option.text}
                              />
                            ))}
                          </RadioGroup>
                        </Stack>
                      );
                    })}

                    {/* <Button sx={{ maxWidth: 400, minWidth: 280, alignSelf: 'center' }} variant="outlined">
                      Submit
                    </Button> */}
                  </>
                )}
              </Stack>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default CoursePreviewQuiz;
