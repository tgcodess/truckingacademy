import React, { useEffect } from 'react';
import { APISERVICES } from '@/api-services';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { useTheme } from '@emotion/react';
import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

import { useSearchParams } from '@/hooks/user-searchparams';
import { Scrollbar } from '@/components/core/scrollbar';

function CoursePreviewPage() {
  const { searchParams, setSearchParams } = useSearchParams();
  const page = searchParams.get('page') || '';
  const unit = searchParams.get('unit') || '';
  const { preViewCourseId } = useParams({ strict: false });
  const { data, isLoading } = useQuery({
    queryKey: ['page_content_', page],
    queryFn: async () => {
      const { data } = await APISERVICES.coursesUnitPage.get(page);

      return data;
    },
  });
  const {
    //@ts-ignore
    palette: { mode },
  } = useTheme();

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: 'paragraph',
      },
    ],
  });

  const setHtmlToEditor = async (content: any) => {
    const blocks = await editor.tryParseHTMLToBlocks(content || '<p></p>');
    editor.replaceBlocks(editor.document, JSON.parse(content));
  };

  useEffect(() => {
    if (data?.description) {
      setHtmlToEditor(data?.description);
    }
  }, [data]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          position: 'absolute',
          zIndex: 100,
          top: -55,
          left: 40,
          right: 0,
          display: 'flex',
        }}
      >
        <Typography variant="h6">{data?.title || 'Untitled'}</Typography>
      </Stack>
      <Scrollbar sx={{ maxHeight: '65vh' }}>
        <Box sx={{ maxHeight: '70vh' }}>
          <BlockNoteView
            style={{
              minHeight: 500,
              // backgroundColor: 'var(--mui-palette-background-paper)',
            }}
            editor={editor}
            theme={mode}
            editable={false}
          />
        </Box>
      </Scrollbar>
    </Box>
  );
}

export default CoursePreviewPage;
