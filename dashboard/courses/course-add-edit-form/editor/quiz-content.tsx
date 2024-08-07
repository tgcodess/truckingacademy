import React, { FC, useEffect } from 'react';
import { APISERVICES } from '@/api-services';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Link,
  OutlinedInput,
  Radio,
  RadioGroup,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/system';
import { CaretRight as CaretRightIcon } from '@phosphor-icons/react/dist/ssr/CaretRight';
import { Trash } from '@phosphor-icons/react/dist/ssr/Trash';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useSearchParams } from '@/hooks/user-searchparams';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
  ({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      // borderBottom: 0,
    },
    '&::before': {
      display: 'none',
    },
  })
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<CaretRightIcon />} {...props} />
))(({ theme }) => ({
  backgroundColor: 'var(--mui-palette-background-paper)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const quizSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().min(1, { message: 'Question is required' }),
      options: z
        .array(
          z.object({
            text: z.string().min(1, { message: 'Option text is required' }),
            feedback: z.unknown(),
            isCorrect: z.boolean().default(false),
          })
        )
        .max(5),
      // .refine((options) => options.some((option) => option.isCorrect), {
      //   message: 'At least one option must be correct',
      //   path: ['text'],
      // }),
    })
  ),
});

const OptionComponent: FC = ({ control, index }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${index}.options`,
  });

  return (
    <>
      {fields?.map((option, optionIndex) => (
        <Stack spacing={1} key={option?.id}>
          <Stack direction={'row'} alignItems={'center'}>
            <Controller
              control={control}
              name={`questions.${index}.options.${optionIndex}.isCorrect`}
              render={({ field, fieldState: { error } }) => {
                return (
                  <IconButton
                    onChange={() => {
                      field?.onChange?.(!field?.value);
                    }}
                  >
                    <Checkbox
                      color="success"
                      checked={field?.value}
                      name={`questions.${index}.options.${optionIndex}.isCorrect`}
                    />
                  </IconButton>
                );
              }}
            />

            <Controller
              control={control}
              name={`questions.${index}.options.${optionIndex}.text`}
              render={({ field, fieldState: { error } }) => {
                return (
                  <>
                    <TextField
                      fullWidth
                      label={'Option Text'}
                      {...field}
                      error={!!error?.message}
                      helperText={error?.message}
                    />
                    {fields?.length > 2 ? (
                      <IconButton sx={{ mb: 0.8 }} onClick={() => remove(optionIndex)}>
                        <SvgIcon>
                          <Trash color="red" />
                        </SvgIcon>
                      </IconButton>
                    ) : (
                      ''
                    )}
                  </>
                );
              }}
            />
          </Stack>
          <Controller
            control={control}
            name={`questions.${index}.options.${optionIndex}.feedback`}
            render={({ field, fieldState: { error } }) => {
              return (
                <Box ml={5} mr={fields?.length > 2 ? 5 : 0}>
                  <TextField
                    fullWidth
                    label={'FeedBack'}
                    {...field}
                    error={!!error?.message}
                    helperText={error?.message}
                    multiline
                  />
                </Box>
              );
            }}
          />
        </Stack>
      ))}
      {fields?.length < 5 && (
        <Typography
          textAlign={'end'}
          color="text.secondary"
          variant="body2"
          onClick={() => {
            if (fields?.length < 5) {
              append({
                id: `${fields?.length + 1}`,
                text: '',
                isCorrect: false,
              });
            }
          }}
        >
          <Link
            sx={{
              ':hover': {
                cursor: 'pointer',
              },
            }}
            underline="none"
            variant="subtitle2"
          >
            Add option
          </Link>
        </Typography>
      )}
    </>
  );
};

function QuizContent() {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      questions: [
        {
          question: '',
          options: [
            { text: '', isCorrect: false, feedback: '' },
            { text: '', isCorrect: false, feedback: '' },
          ],
        },
      ],
    },
    resolver: zodResolver(quizSchema),
  });

  console.log(errors);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const handleAppend = () => {
    append({
      question: '',
      options: [
        { text: '', isCorrect: false, feedback: '' },
        { text: '', isCorrect: false, feedback: '' },
      ],
    });
  };

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

  const { mutate, isPending } = useMutation({
    mutationKey: ['course_quiz_', quiz, unit],
    mutationFn: async (content) => {
      return await APISERVICES.coursesUnitQuiz.put(quiz, {
        title: data?.title,
        ...((content as any) ? content : {}),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['course_quiz_', quiz],
      });
      toast.success(data?.message || 'Exam content updated successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
      console.log('error', error);
    },
  });

  const onSubmit = (data: any) => {
    let hasError = false;
    data.questions.forEach((question: any, index: number) => {
      const hasCorrectOption = question.options.some((option: any) => option.isCorrect);
      if (!hasCorrectOption) {
        toast.error(`Question ${index + 1}: At least one option must be marked as correct`);
        setError(`questions.${index}.question`, {
          type: 'manual',
          message: 'At least one option must be marked as correct',
        });
        hasError = true;
      }
    });

    if (hasError) return;

    mutate(data);
  };

  useEffect(() => {
    if (data) {
      reset({
        questions: data?.questions || [
          {
            question: '',
            options: [
              { text: '', isCorrect: false, feedback: '' },
              { text: '', isCorrect: false, feedback: '' },
            ],
          },
        ],
      });
    }
  }, [data]);

  return (
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

      <Card>
        <CardContent>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Stack spacing={2} direction={'row'} alignItems={'center'}>
              <Typography variant="subtitle1">Total No. of questions </Typography>
              <OutlinedInput
                disabled
                value={fields.length}
                sx={{
                  width: 64,

                  px: 1,
                }}
              />
            </Stack>
          </Stack>

          <Stack>
            <Box sx={{ pt: 4 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field, index) => (
                  <Accordion key={field?.id} sx={{ mb: 2 }}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                      <Stack
                        sx={{ width: '100%' }}
                        direction={'row'}
                        spacing={2}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                      >
                        <Controller
                          control={control}
                          name={`questions.${index}.question`}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              {...field}
                              helperText={error?.message}
                              error={Boolean(error?.message)}
                              label="Question"
                              multiline
                              fullWidth
                            />
                          )}
                        />
                        <Stack spacing={2} direction={'row'} alignItems={'center'}>
                          {fields?.length > 1 ? (
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                remove(index);
                              }}
                            >
                              <Trash color="var(--mui-palette-error-main)" size={20} />
                            </IconButton>
                          ) : (
                            ''
                          )}
                        </Stack>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={2}>
                        <Typography>Options (check which is correct)</Typography>
                        <Stack spacing={2}>
                          <OptionComponent
                            //@ts-ignore
                            control={control}
                            index={index}
                          />
                        </Stack>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}

                <Button type="button" variant="outlined" onClick={handleAppend}>
                  Add Question
                </Button>
                <Stack alignItems="center" justifyContent="center" mt={8}>
                  <Button
                    sx={{
                      minWidth: 280,
                    }}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Save
                  </Button>
                </Stack>
              </form>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default QuizContent;
