import React, { ChangeEvent, useCallback, useEffect } from 'react';

import '@blocknote/core/fonts/inter.css';

import { BlockNoteView, darkDefaultTheme, lightDefaultTheme, Theme } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';

import '@blocknote/mantine/style.css';

import { APISERVICES } from '@/api-services';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Typography } from '@mui/material';
import { Box, Stack, useTheme } from '@mui/system';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useSearchParams } from '@/hooks/user-searchparams';
import Loader from '@/components/core/loader';
import { Scrollbar } from '@/components/core/scrollbar';

async function uploadFile(file: File) {
  const body = new FormData();
  body.append('file', file);

  const res = await APISERVICES.upload.post(body);
  console.log(res);

  return res.url;
}

function PageContentEditor() {
  const { searchParams, setSearchParams } = useSearchParams();
  const page = searchParams.get('page') || '';
  const unit = searchParams.get('unit') || '';

  const {
    palette: { mode },
  } = useTheme();

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: 'paragraph',
      },
    ],
    uploadFile,
  });

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['page_content_', page],
    queryFn: async () => {
      const { data } = await APISERVICES.coursesUnitPage.get(page);
      setHtmlToEditor(data?.description);
      return data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ['page_content_edit_', page, unit],
    mutationFn: async (content) => {
      return await APISERVICES.coursesUnitPage.put(page, {
        title: data?.title,
        description: content,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['page_content_', page],
      });

      toast.success(data?.message || 'Page content updated successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
      console.log('error', error);
    },
  });

  const onChange = async () => {
    //@ts-ignore
    mutate(JSON.stringify(editor?.document));
  };

  const setHtmlToEditor = async (content: any) => {
    const blocks = await editor.tryParseHTMLToBlocks(content || '<p></p>');
    editor.replaceBlocks(editor.document, JSON.parse(content));
  };

  useEffect(() => {
    if (data?.description) {
      setHtmlToEditor(data?.description);
    } else {
      setHtmlToEditor(
        JSON.stringify([
          {
            type: 'paragraph',
          },
        ])
      );
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

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
        <LoadingButton variant="outlined" loading={isPending} loadingPosition="end" onClick={onChange}>
          Save
        </LoadingButton>
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
          />
        </Box>
      </Scrollbar>
    </Box>
  );
}

export default PageContentEditor;
