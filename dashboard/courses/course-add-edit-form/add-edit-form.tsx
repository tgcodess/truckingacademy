import React, { useEffect, useState } from 'react';
import { APISERVICES } from '@/api-services';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Button,
  Drawer,
  Grid,
  IconButton,
  OutlinedInput,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { Box, minHeight, Stack } from '@mui/system';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { CaretDown } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { List } from '@phosphor-icons/react/dist/ssr/List';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';

import { paths } from '@/paths';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useSearchParams } from '@/hooks/user-searchparams';
import { RouterLink } from '@/components/core/link';
import Loader from '@/components/core/loader';
import { Scrollbar } from '@/components/core/scrollbar';
import { TextEditor } from '@/components/core/text-editor/text-editor';

import { renderNavGroups } from '../../layout/mobile-nav';
import ExamContent from './editor/exam-content';
import PageContentEditor from './editor/page-content';
import QuizContent from './editor/quiz-content';
import NavTree from './sidebar-content';

function AddEditForm({ edit = false, courseId = '' }: { edit?: boolean; courseId?: string }) {
  const { searchParams, setSearchParams } = useSearchParams();
  const page = searchParams.get('page') || false;
  const quiz = searchParams.get('quiz') || false;
  const exam = searchParams.get('exam') || false;

  const mdDown = useMediaQuery('down', 'md');
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
  const [openDesktopSidebar, setOpenDesktopSidebar] = useState(true);
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flex: '1 1 0', minHeight: 0 }}>
        <Sidebar
          onCloseMobile={() => {
            setOpenMobileSidebar(false);
          }}
          openDesktop={openDesktopSidebar}
          openMobile={openMobileSidebar}
        />
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', overflow: 'hidden' }}>
          <Stack
            direction={'row'}
            alignItems={'center'}
            spacing={1}
            sx={{
              // borderBottom: '1px solid var(--mui-palette-divider)',
              p: 1,
            }}
          >
            <IconButton
              onClick={() => {
                if (mdDown) {
                  setOpenMobileSidebar((prev) => !prev);
                } else {
                  setOpenDesktopSidebar((prev) => !prev);
                }
              }}
            >
              <List />
            </IconButton>
          </Stack>
          <Box sx={{ p: 2 }}>
            {page ? <PageContentEditor /> : ''}
            {quiz ? <QuizContent /> : ''}
            {exam ? <ExamContent /> : ''}
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default AddEditForm;

export interface SidebarProps {
  currentThreadId?: string;
  // messages: Map<string, Message[]>;
  onCloseMobile?: () => void;
  onSelectContact?: (contactId: string) => void;
  onSelectThread?: (threadType: string, threadId: string) => void;
  openDesktop?: boolean;
  openMobile?: boolean;
}

function Sidebar({ openDesktop, openMobile, onCloseMobile }: SidebarProps) {
  const mdUp = useMediaQuery('up', 'md');

  const content = <SidebarContent onClose={onCloseMobile} />;

  if (mdUp) {
    return (
      <Box
        sx={{
          borderRight: '1px solid var(--mui-palette-divider)',
          flex: '0 0 auto',
          ml: openDesktop ? 0 : '-320px',
          position: 'relative',
          transition: 'margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
          width: '320px',
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Drawer PaperProps={{ sx: { maxWidth: '100%', width: '320px' } }} onClose={onCloseMobile} open={openMobile}>
      {content}
    </Drawer>
  );
}

interface SidebarContentProps {
  closeOnGroupClick?: boolean;
  closeOnThreadSelect?: boolean;
  currentThreadId?: string;
  onClose?: () => void;
  onSelectContact?: (contactId: string) => void;
  onSelectThread?: (threadType: string, threadId: string) => void;
}

function SidebarContent({
  closeOnGroupClick,
  closeOnThreadSelect,
  currentThreadId,
  onClose,
  onSelectContact,
  onSelectThread,
}: SidebarContentProps) {
  const { courseId } = useParams({ strict: false });
  const { preViewCourseId } = useParams({ strict: false });

  const { data, isLoading } = useQuery({
    queryKey: ['table_course_', courseId || preViewCourseId],
    queryFn: async () => {
      const { data } = await APISERVICES.tableOfContent.get(courseId || preViewCourseId);
      return data;
    },
  });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['table_course_edit_', courseId],
    mutationFn: async () => {
      return await APISERVICES.coursesUnit.post(
        {
          name: 'Undefined Unit',
        },
        courseId
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['table_course_', courseId],
      });
      toast.success(data?.message || 'Table of content updated successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
      console.log('error', error);
    },
  });
  const mdUp = useMediaQuery('up', 'md');
  const router = useRouter();

  const query = router?.latestLocation?.searchStr;
  useEffect(() => {
    if (!query && data) {
      router.navigate({ to: data?.[0]?.items?.[0]?.href, replace: true, resetScroll: true });
    }
  }, [query, data]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '0 0 auto', p: 2 }}>
        <Typography sx={{ flex: '1 1 auto' }} variant="h6">
          Table Of Content
        </Typography>

        <IconButton onClick={onClose} sx={{ display: { md: 'none' } }}>
          <X />
        </IconButton>
      </Stack>
      <Stack spacing={2} sx={{ flex: '1 1 auto', overflowY: 'auto', p: 2 }}>
        <Stack>
          <Scrollbar sx={mdUp ? { height: '74vh' } : {}}>
            {!isLoading ? <NavTree data={data || []} /> : <Loader />}
            <LoadingButton
              loadingPosition="center"
              loading={isPending}
              onClick={() => mutate()}
              sx={{ mt: 2 }}
              variant="outlined"
              fullWidth
            >
              <Plus weight="bold" size={18} /> Add Unit
            </LoadingButton>{' '}
          </Scrollbar>
        </Stack>
      </Stack>
    </Box>
  );
}
