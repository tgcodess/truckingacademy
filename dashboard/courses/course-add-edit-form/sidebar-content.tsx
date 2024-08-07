import React, { useEffect } from 'react';
import { APISERVICES } from '@/api-services';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  MenuItem,
  OutlinedInput,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { ArrowSquareOut as ArrowSquareOutIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareOut';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { CaretRight as CaretRightIcon } from '@phosphor-icons/react/dist/ssr/CaretRight';
import { DotsThreeVertical } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash } from '@phosphor-icons/react/dist/ssr/Trash';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useDialog } from '@/hooks/use-dialog';
import { usePopover } from '@/hooks/use-popover';
import { useSearchParams } from '@/hooks/user-searchparams';
import { ConfirmationDialog } from '@/components/core/confirmation-dialog';
import DialogWrapper from '@/components/core/dialog-wrapper';
import { RouterLink } from '@/components/core/link';
import { PopoverButton } from '@/components/core/popover-button';
import { Scrollbar } from '@/components/core/scrollbar';

const json = [
  {
    items: [
      {
        title: 'Unit 1',
        id: '1',
        key: 'unit-1',
        href: '?unit=1',
        type: 'unit',
        items: [
          {
            title: 'Lesson 1 (ID: 34)',
            type: 'page',
            id: '34',
            href: '?unit=1&page=34',
            key: '1-page-34',
          },
          {
            title: 'Quiz 1 (ID: 78)',
            type: 'quiz',
            id: '78',
            href: '?unit=1&quiz=78',
            key: '1-quiz-78',
          },
          {
            title: 'Exam 1 (ID: 56)',
            type: 'exam',
            id: '56',
            href: '?unit=1&exam=56',
            key: '1-exam-56',
          },
          {
            title: 'Lesson 2 (ID: 23)',
            type: 'page',
            id: '23',
            href: '?unit=1&page=23',
            key: '1-page-23',
          },
          {
            title: 'Quiz 2 (ID: 91)',
            type: 'quiz',
            id: '91',
            href: '?unit=1&quiz=91',
            key: '1-quiz-91',
          },
          {
            title: 'Lesson 3 (ID: 12)',
            type: 'page',
            id: '12',
            href: '?unit=1&page=12',
            key: '1-page-12',
          },
          {
            title: 'Exam 2 (ID: 67)',
            type: 'exam',
            id: '67',
            href: '?unit=1&exam=67',
            key: '1-exam-67',
          },
          {
            title: 'Quiz 3 (ID: 45)',
            type: 'quiz',
            id: '45',
            href: '?unit=1&quiz=45',
            key: '1-quiz-45',
          },
        ],
      },
      {
        type: 'unit',
        title: 'Unit 2',
        id: '2',
        key: 'unit-2',
        href: '?unit=2',
        items: [
          {
            title: 'Lesson 1 (ID: 11)',
            type: 'page',
            id: '11',
            href: '?unit=2&page=11',
            key: '2-page-11',
          },
          {
            title: 'Quiz 1 (ID: 34)',
            type: 'quiz',
            id: '34',
            href: '?unit=2&quiz=34',
            key: '2-quiz-34',
          },
          {
            title: 'Exam 1 (ID: 89)',
            type: 'exam',
            id: '89',
            href: '?unit=2&exam=89',
            key: '2-exam-89',
          },
          {
            title: 'Lesson 2 (ID: 56)',
            type: 'page',
            id: '56',
            href: '?unit=2&page=56',
            key: '2-page-56',
          },
          {
            title: 'Quiz 2 (ID: 27)',
            type: 'quiz',
            id: '27',
            href: '?unit=2&quiz=27',
            key: '2-quiz-27',
          },
          {
            title: 'Lesson 3 (ID: 62)',
            type: 'page',
            id: '62',
            href: '?unit=2&page=62',
            key: '2-page-62',
          },
          {
            title: 'Exam 2 (ID: 78)',
            type: 'exam',
            id: '78',
            href: '?unit=2&exam=78',
            key: '2-exam-78',
          },
          {
            title: 'Quiz 3 (ID: 99)',
            type: 'quiz',
            id: '99',
            href: '?unit=2&quiz=99',
            key: '2-quiz-99',
          },
        ],
      },
      {
        type: 'unit',
        title: 'Unit 3',
        id: '3',
        key: 'unit-3',
        href: '?unit=3',
        items: [
          {
            title: 'Lesson 1 (ID: 10)',
            type: 'page',
            id: '10',
            href: '?unit=3&page=10',
            key: '3-page-10',
          },
          {
            title: 'Quiz 1 (ID: 32)',
            type: 'quiz',
            id: '32',
            href: '?unit=3&quiz=32',
            key: '3-quiz-32',
          },
          {
            title: 'Exam 1 (ID: 85)',
            type: 'exam',
            id: '85',
            href: '?unit=3&exam=85',
            key: '3-exam-85',
          },
          {
            title: 'Lesson 2 (ID: 49)',
            type: 'page',
            id: '49',
            href: '?unit=3&page=49',
            key: '3-page-49',
          },
          {
            title: 'Quiz 2 (ID: 71)',
            type: 'quiz',
            id: '71',
            href: '?unit=3&quiz=71',
            key: '3-quiz-71',
          },
          {
            title: 'Lesson 3 (ID: 93)',
            type: 'page',
            id: '93',
            href: '?unit=3&page=93',
            key: '3-page-93',
          },
          {
            title: 'Exam 2 (ID: 64)',
            type: 'exam',
            id: '64',
            href: '?unit=3&exam=64',
            key: '3-exam-64',
          },
          {
            title: 'Quiz 3 (ID: 57)',
            type: 'quiz',
            id: '57',
            href: '?unit=3&quiz=57',
            key: '3-quiz-57',
          },
        ],
      },
      {
        type: 'unit',
        title: 'Unit 4',
        id: '4',
        key: 'unit-4',
        href: '?unit=4',
        items: [
          {
            title: 'Lesson 1 (ID: 21)',
            type: 'page',
            id: '21',
            href: '?unit=4&page=21',
            key: '4-page-21',
          },
          {
            title: 'Quiz 1 (ID: 38)',
            type: 'quiz',
            id: '38',
            href: '?unit=4&quiz=38',
            key: '4-quiz-38',
          },
          {
            title: 'Exam 1 (ID: 74)',
            type: 'exam',
            id: '74',
            href: '?unit=4&exam=74',
            key: '4-exam-74',
          },
          {
            title: 'Lesson 2 (ID: 48)',
            type: 'page',
            id: '48',
            href: '?unit=4&page=48',
            key: '4-page-48',
          },
          {
            title: 'Quiz 2 (ID: 65)',
            type: 'quiz',
            id: '65',
            href: '?unit=4&quiz=65',
            key: '4-quiz-65',
          },
          {
            title: 'Lesson 3 (ID: 83)',
            type: 'page',
            id: '83',
            href: '?unit=4&page=83',
            key: '4-page-83',
          },
          {
            title: 'Exam 2 (ID: 99)',
            type: 'exam',
            id: '99',
            href: '?unit=4&exam=99',
            key: '4-exam-99',
          },
          {
            title: 'Quiz 3 (ID: 24)',
            type: 'quiz',
            id: '24',
            href: '?unit=4&quiz=24',
            key: '4-quiz-24',
          },
        ],
      },
      {
        type: 'unit',
        title: 'Unit 5',
        id: '5',
        key: 'unit-5',
        href: '?unit=5',
        items: [
          {
            title: 'Lesson 1 (ID: 9)',
            type: 'page',
            id: '9',
            href: '?unit=5&page=9',
            key: '5-page-9',
          },
          {
            title: 'Quiz 1 (ID: 47)',
            type: 'quiz',
            id: '47',
            href: '?unit=5&quiz=47',
            key: '5-quiz-47',
          },
          {
            title: 'Exam 1 (ID: 81)',
            type: 'exam',
            id: '81',
            href: '?unit=5&exam=81',
            key: '5-exam-81',
          },
          {
            title: 'Lesson 2 (ID: 66)',
            type: 'page',
            id: '66',
            href: '?unit=5&page=66',
            key: '5-page-66',
          },
          {
            title: 'Quiz 2 (ID: 12)',
            type: 'quiz',
            id: '12',
            href: '?unit=5&quiz=12',
            key: '5-quiz-12',
          },
          {
            title: 'Lesson 3 (ID: 30)',
            type: 'page',
            id: '30',
            href: '?unit=5&page=30',
            key: '5-page-30',
          },
          {
            title: 'Exam 2 (ID: 52)',
            type: 'exam',
            id: '52',
            href: '?unit=5&exam=52',
            key: '5-exam-52',
          },
          {
            title: 'Quiz 3 (ID: 93)',
            type: 'quiz',
            id: '93',
            href: '?unit=5&quiz=93',
            key: '5-quiz-93',
          },
        ],
      },
    ],
  },
];

const RenameDialog = ({ popoverButton, label = 'unit', value = '', onSubmit = () => {}, loading = false }: any) => {
  const dialog = useDialog();

  const schema = z.object({
    value: z.string().min(1, label?.toUpperCase() + ' is Required'),
  });

  type Values = z.infer<typeof schema>;

  const defaultValues = {
    value,
  } satisfies Values;
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const handleOpen = () => {
    dialog.handleOpen();
  };

  const handleClose = () => {
    dialog?.handleClose();
    popoverButton?.handleClose();
  };

  const handleSubmitForm = async (values: Values): Promise<void> => {
    onSubmit({ value: values?.value, handleClose });
  };

  return (
    <>
      <MenuItem dense sx={{ py: 0.8 }} onClick={dialog.handleOpen}>
        Rename
      </MenuItem>

      <DialogWrapper
        dialogHeading={'Rename ' + label}
        open={dialog.open}
        onClose={handleClose}
        loading={loading}
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <Stack pt={1}>
          <Controller
            control={control}
            name="value"
            render={({ field, fieldState: { error, isDirty } }) => {
              return (
                <TextField
                  {...field}
                  helperText={error?.message}
                  error={Boolean(error?.message)}
                  label={label + ' name'}
                  fullWidth
                />
              );
            }}
          />
        </Stack>
      </DialogWrapper>
    </>
  );
};

const AddButtonContent = ({ unit, value }: { unit: string | number; value: string }) => {
  const popover = usePopover<HTMLButtonElement>();
  const popoverButton = usePopover<HTMLButtonElement>();
  const queryClient = useQueryClient();
  const { courseId } = useParams({ strict: false });

  const handleClose = () => {
    popoverButton?.handleClose();
    popover?.handleClose();
  };

  const { mutate: DeleteUnit, isPending: unitDeletePending } = useMutation({
    mutationKey: ['table_course_edit_', courseId],
    mutationFn: async () => {
      return await APISERVICES.coursesUnit.delete(unit);
    },
    onSuccess: (data) => {
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['table_course_', courseId],
      });
      toast.success(data?.message || 'Table of content updated successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });

  const { mutate: RenameUnit, isPending: unitRenamePending } = useMutation({
    mutationKey: ['table_course_edit_', courseId],
    mutationFn: async (values: any) => {
      return await APISERVICES.coursesUnit.put(unit, {
        name: values?.value,
      });
    },
    onSuccess: (data, variables: any) => {
      variables?.handleClose?.();
      queryClient.invalidateQueries({
        queryKey: ['table_course_', courseId],
      });
      toast.success(data?.message || 'Table of content updated successfully');
    },
    onError: (error, variables) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });

  const { mutate: AddSubPage, isPending: addSubPagePending } = useMutation({
    mutationKey: ['table_course_edit_', courseId],
    mutationFn: async () => {
      return await APISERVICES.coursesUnitPage.post({}, unit);
    },
    onSuccess: (data) => {
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['table_course_', courseId],
      });
      toast.success(data?.message || 'Table of content updated successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
  const { mutate: AddQuiz, isPending: addQuizPending } = useMutation({
    mutationKey: ['table_course_edit_', courseId],
    mutationFn: async () => {
      return await APISERVICES.coursesUnitQuiz.post({}, unit);
    },
    onSuccess: (data) => {
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['table_course_', courseId],
      });
      toast.success(data?.message || 'Table of content updated successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
  const { mutate: AddExam, isPending: addExamPending } = useMutation({
    mutationKey: ['table_course_edit_', courseId],
    mutationFn: async () => {
      return await APISERVICES.coursesUnitExam.post({}, unit);
    },
    onSuccess: (data) => {
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['table_course_', courseId],
      });
      toast.success(data?.message || 'Table of content updated successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });

  return (
    <>
      <PopoverButton
        popover={popoverButton}
        button={
          <IconButton sx={{ mb: 0.5 }}>
            <DotsThreeVertical weight="bold" />
          </IconButton>
        }
      >
        <Stack>
          <List sx={{ p: 0.5, width: '100%' }}>
            <RenameDialog
              loading={unitRenamePending}
              onSubmit={RenameUnit}
              value={value}
              unit={unit}
              popoverButton={popoverButton}
            />

            <MenuItem
              dense
              sx={{ py: 0.8 }}
              onClick={() => {
                AddSubPage();
              }}
            >
              Add SubPage
            </MenuItem>
            <MenuItem
              dense
              sx={{ py: 0.8 }}
              onClick={() => {
                AddQuiz();
              }}
            >
              Add Quiz
            </MenuItem>
            <MenuItem
              dense
              sx={{ py: 0.8 }}
              onClick={() => {
                AddExam();
              }}
            >
              Add Exam
            </MenuItem>
            <ConfirmationDialog
              onCancel={popover.handleClose}
              onConfirm={() => {
                DeleteUnit();
                popoverButton.handleClose();
              }}
              title="Delete Unit"
              desc="Are you sure you want to delete this unit ?"
              openButton={
                <MenuItem dense sx={{ py: 0.8, width: '100%', color: 'var(--mui-palette-error-main)' }}>
                  <Trash size={16} color="var(--mui-palette-error-main)" /> Delete
                </MenuItem>
              }
            ></ConfirmationDialog>
          </List>
        </Stack>
      </PopoverButton>
    </>
  );
};

const EditContent = ({ type, id, value = '' }: any) => {
  const popover = usePopover<HTMLButtonElement>();
  const popoverButton = usePopover<HTMLButtonElement>();
  const queryClient = useQueryClient();
  const { courseId } = useParams({ strict: false });

  const handleClose = () => {
    popover.handleClose();
    popoverButton.handleClose();
  };

  const { mutate: RenameSubpage, isPending: subpageRenamePending } = useMutation({
    mutationKey: ['table_course_edit_', courseId],
    mutationFn: async (values: any) => {
      return await APISERVICES.coursesUnitPage.put(id, {
        title: values?.value,
      });
    },
    onSuccess: (data, variables: any) => {
      variables?.handleClose?.();
      queryClient.invalidateQueries({
        queryKey: ['table_course_', courseId],
      });
      toast.success(data?.message || 'Table of content updated successfully');
    },
    onError: (error, variables) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
  const { mutate: RenameQuiz, isPending: quizRenamePending } = useMutation({
    mutationKey: ['table_course_edit_', courseId],
    mutationFn: async (values: any) => {
      return await APISERVICES.coursesUnitQuiz.put(id, {
        title: values?.value,
      });
    },
    onSuccess: (data, variables: any) => {
      variables?.handleClose?.();
      queryClient.invalidateQueries({
        queryKey: ['table_course_', courseId],
      });
      toast.success(data?.message || 'Table of content updated successfully');
    },
    onError: (error, variables) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
  const { mutate: RenameExam, isPending: examRenamePending } = useMutation({
    mutationKey: ['table_course_edit_', courseId],
    mutationFn: async (values: any) => {
      return await APISERVICES.coursesUnitExam.put(id, {
        title: values?.value,
      });
    },
    onSuccess: (data, variables: any) => {
      variables?.handleClose?.();
      queryClient.invalidateQueries({
        queryKey: ['table_course_', courseId],
      });
      toast.success(data?.message || 'Table of content updated successfully');
    },
    onError: (error, variables) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });

  const { mutate: DeleteSubpage, isPending: subpageDeletePending } = useMutation({
    mutationKey: ['table_course_edit_', courseId],
    mutationFn: async (values: any) => {
      return await APISERVICES.coursesUnitPage.delete(id);
    },
    onSuccess: (data) => {
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['table_course_', courseId],
      });
      toast.success(data?.message || 'Table of content updated successfully');
    },
    onError: (error, variables) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
  const { mutate: DeleteQuiz, isPending: quizDeletePending } = useMutation({
    mutationKey: ['table_course_edit_', courseId],
    mutationFn: async () => {
      return await APISERVICES.coursesUnitQuiz.delete(id);
    },
    onSuccess: (data) => {
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['table_course_', courseId],
      });
      toast.success(data?.message || 'Table of content updated successfully');
    },
    onError: (error, variables) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
  const { mutate: DeleteExam, isPending: examDeletePending } = useMutation({
    mutationKey: ['table_course_edit_', courseId],
    mutationFn: async (values: any) => {
      return await APISERVICES.coursesUnitExam.delete(id);
    },
    onSuccess: (data) => {
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['table_course_', courseId],
      });
      toast.success(data?.message || 'Table of content updated successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });

  const onsubmit =
    type == 'page' ? RenameSubpage : type === 'quiz' ? RenameQuiz : type === 'exam' ? RenameExam : () => {};
  const deleteById =
    type == 'page' ? DeleteSubpage : type === 'quiz' ? DeleteQuiz : type === 'exam' ? DeleteExam : () => {};

  return (
    <>
      <PopoverButton
        popover={popoverButton}
        button={
          <IconButton sx={{ mb: 0.5 }}>
            <DotsThreeVertical weight="bold" />
          </IconButton>
        }
      >
        <Stack>
          <List sx={{ p: 0.5, width: '100%' }}>
            <RenameDialog
              onSubmit={onsubmit}
              loading={subpageRenamePending || quizRenamePending || examRenamePending}
              value={value}
              label={type}
              popoverButton={popoverButton}
            />

            <ConfirmationDialog
              onCancel={popover.handleClose}
              //@ts-ignore
              onConfirm={() => deleteById()}
              title={'Delete ' + type}
              desc={`Are you sure you want to delete this ${type} ?`}
              openButton={
                <MenuItem
                  dense
                  sx={{ py: 0.8, width: '100%', color: 'var(--mui-palette-error-main)' }}
                  // onClick={() => {
                  //   navigate({ to: paths.dashboard.courses.edit(rows?.id) });
                  // }}
                >
                  <Trash size={16} color="var(--mui-palette-error-main)" /> Delete
                </MenuItem>
              }
            ></ConfirmationDialog>
          </List>
        </Stack>
      </PopoverButton>
    </>
  );
};

const DeleteButton = ({ type, id }: any) => {
  const popover = usePopover<HTMLButtonElement>();
  const popoverButton = usePopover<HTMLButtonElement>();
  return <></>;
};

interface NavItemConfig {
  key: string;
  title?: string;
  items?: NavItemConfig[];
  href?: string;
  type?: string;
}

function renderNavGroups({
  items,
  query,
  view = false,
}: {
  items: NavItemConfig[];
  query: string;
  view: boolean;
}): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    acc.push(
      <div>
        {/* <Stack component="li" key={curr.key} spacing={0}> */}
        {/* {curr.title ? (
          <div>
            <Typography
              sx={{ color: 'var(--NavGroup-title-color)', fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5 }}
            >
              {curr.title}
            </Typography>
            <Typography
              sx={{
                color: 'var(--NavGroup-subtitle-color)',
                fontSize: '0.75rem',
                fontWeight: 400,
                lineHeight: 1.5,
                mt: 0.5,
              }}
            >
              Group Description Placeholder
            </Typography>
          </div>
        ) : null} */}
        <div>{renderNavItems({ depth: 0, items: curr.items, query, view })}</div>
        {/* </Stack> */}
      </div>
    );

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={2} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

function renderNavItems({
  depth = 0,
  items = [],
  query,
  view = false,
}: {
  depth: number;
  items?: NavItemConfig[];
  query: string;
  view: boolean;
}): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { items: childItems, key, ...item } = curr;

    const forceOpen = childItems ? Boolean(childItems.find((childItem) => childItem?.href == query)) : false;

    acc.push(
      <NavItem depth={depth} forceOpen={forceOpen} key={key} query={query} view={view} {...item}>
        {childItems ? renderNavItems({ depth: depth + 1, query, items: childItems, view }) : null}
      </NavItem>
    );

    return acc;
  }, []);

  return (
    <Stack component="ul" data-depth={depth} spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  children?: React.ReactNode;
  depth: number;
  forceOpen?: boolean;
  query: string;
  view?: boolean;
}

function NavItem({
  children,
  depth,
  forceOpen = false,
  href,
  query,
  title,
  view = false,
  type,
  ...rest
}: NavItemProps): React.JSX.Element {
  const [open, setOpen] = React.useState<boolean>(forceOpen);
  const active = isNavItemActive({ href, query });

  const ExpandIcon = open ? CaretDownIcon : CaretRightIcon;
  const isBranch = children && type == 'unit';
  const showChildren = Boolean(children && open);

  return (
    <Box component="li" data-depth={depth} sx={{ userSelect: 'none' }}>
      <Stack direction="row" alignItems={'center'}>
        <Box
          {...(isBranch
            ? {
                onClick: (): void => {
                  setOpen(!open);
                },
                onKeyUp: (event: React.KeyboardEvent<HTMLDivElement>): void => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    setOpen(!open);
                  }
                },
                role: 'button',
              }
            : {
                ...(href
                  ? {
                      component: RouterLink,
                      replace: true,
                      href,
                    }
                  : { role: 'button' }),
              })}
          sx={{
            width: view ? '100%' : '86%',
            alignItems: 'center',
            borderRadius: 1,
            color: 'var(--NavItem-color)',
            cursor: 'pointer',
            display: 'flex',
            flex: '0 0 auto',
            gap: 1,
            mb: 0.8,
            p: '6px 16px',
            position: 'relative',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            ...(active &&
              !isBranch && {
                bgcolor: 'var(--mui-palette-divider)',
                color: 'var(--NavItem-active-color)',
                ...(depth > 0 && {
                  '&::before': {
                    bgcolor: 'var(--mui-palette-divider)',
                    borderRadius: '2px',
                    content: '" "',
                    height: '20px',
                    left: '-14px',
                    position: 'absolute',
                    width: '3px',
                  },
                }),
              }),

            ...(open && { color: 'var(--NavItem-open-color)' }),
            '&:hover': !isBranch
              ? {
                  bgcolor: 'var(--mui-palette-divider)',
                  color: 'var(--NavItem-hover-color)',
                }
              : {},
          }}
          tabIndex={0}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography
              // component="span"
              noWrap
              sx={{ width: '90%', color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
            >
              {title}
            </Typography>
          </Box>
          {/* {type ? <Chip color="primary" label={type.toUpperCase()} size="small" /> : null} */}
          {isBranch ? (
            <Box sx={{ alignItems: 'center', display: 'flex', flex: '0 0 auto' }}>
              <ExpandIcon fontSize="var(--icon-fontSize-sm)" />
            </Box>
          ) : null}
        </Box>
        {view ? null : (
          <>
            {isBranch ? (
              <AddButtonContent
                //@ts-ignore
                value={title}
                //@ts-ignore
                unit={rest?.id}
              />
            ) : (
              <EditContent
                type={type}
                value={title}
                //@ts-ignore
                id={rest?.id}
              />
            )}
          </>
        )}
      </Stack>
      {showChildren ? (
        <Box sx={{ pl: '24px' }}>
          <Box sx={{ borderLeft: '1px solid var(--NavItem-children-border)', pl: '12px' }}>{children}</Box>
        </Box>
      ) : null}
    </Box>
  );
}

function isNavItemActive({ href, query }: { href?: string; query: string }): boolean {
  return href ? query.includes(href) : false;
}

export default function NavTree({ data, view = false }: any): React.JSX.Element {
  const { searchParams } = useSearchParams();
  const router = useRouter();

  const query = router?.latestLocation?.searchStr;

  const items = [
    {
      items: data,
    },
  ].map((item, index) => ({ ...item, key: `group-${index}` }));

  return <>{renderNavGroups({ items, query, view })}</>;
}
