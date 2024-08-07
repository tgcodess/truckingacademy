import React, { useState } from 'react';
import { APISERVICES } from '@/api-services';
import { AppBar, Button, Drawer, Grid, IconButton, Tab, Tabs, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { List } from '@phosphor-icons/react/dist/ssr/List';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { paths } from '@/paths';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useSearchParams } from '@/hooks/user-searchparams';
import { RouterLink } from '@/components/core/link';
import Loader from '@/components/core/loader';

import AddEditForm from './add-edit-form';
import Exam from './exam';
import Settings from './settings';
import Students from './students';

const tabs = [
  { title: 'Edit', value: 'edit' },
  { title: 'Exam List', value: 'exam' },
  { title: 'All Students', value: 'students' },
  { title: 'Settings', value: 'settings' },
];
function CourseAddEditForm({
  edit = false,
  courseId = '',
  course = {},
}: {
  edit?: boolean;
  courseId?: string;
  course: Record<any, any>;
}) {
  const navigate = useNavigate();
  const { searchParams, setSearchParams } = useSearchParams();
  const current = searchParams.get('current') || 'edit';
  const mdDown = useMediaQuery('down', 'md');

  return (
    <React.Fragment>
      <Stack
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          // borderTop: '1px solid var(--mui-palette-divider)',
          pb: 0.8,
        }}
        direction={'row'}
        alignContent={'center'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Stack>
          <Typography variant="h6">{course?.title}</Typography>
        </Stack>
        <Tabs
          indicatorColor="primary"
          onChange={(e, value) => {
            //@ts-ignore
            setSearchParams('current', value);
          }}
          textColor="primary"
          value={current}
          variant="scrollable"
          scrollButtons
        >
          {tabs?.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="start"
              label={tab.title}
              sx={{
                fontSize: 16,
              }}
              value={tab.value}
            />
          ))}
        </Tabs>
        <Stack direction={'row'} spacing={2}>
          <Button onClick={() => navigate({ to: paths.dashboard.courses.preview(courseId) })} variant="outlined">
            Preview
          </Button>
          <Button variant="outlined">Save as Draft</Button>
          <Button variant="contained">Publish</Button>
        </Stack>
      </Stack>
      {current == 'edit' ? <AddEditForm edit={edit} courseId={courseId} /> : ''}
      {current == 'settings' ? <Settings edit={edit} courseId={courseId} /> : ''}
      {current == 'exam' ? <Exam edit={edit} courseId={courseId} /> : ''}
      {current == 'students' ? <Students edit={edit} courseId={courseId} /> : ''}
    </React.Fragment>
  );
}

export default CourseAddEditForm;
