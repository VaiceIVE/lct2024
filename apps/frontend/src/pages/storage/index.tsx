import { Flex, Loader, useMantineTheme } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import FileServices from 'shared/services/FilesServices';

import { PageWrapper } from 'shared/ui/Wrappers/PageWrapper';
import { StorageFiles } from 'widgets/storage-files';
import { StorageHistory } from 'widgets/storage-history';
import { StorageUploadCard } from 'widgets/storage-upload-card';

const StoragePage = () => {
  const theme = useMantineTheme();

  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const [isLoading, setLoading] = useState(true);

  const resetRef = useRef<() => void>(null);

  const getUploadedFiles = () => {
    setLoading(true);
    FileServices.getUploadedFiles()
      .then((response) => setUploadedFiles(response.data))
      .finally(() => setLoading(false));
  };

  const handleDeleteUploadedFile = (name: string) => {
    FileServices.deleteFile(name).then(() => {
      getUploadedFiles();
    });
    setLoading(false);
  };

  useEffect(() => {
    getUploadedFiles();
  }, []);

  useEffect(() => {
    if (file) {
      FileServices.uploadFile(file)
        .then(() => {
          getUploadedFiles();
        })
        .finally(() => resetRef.current?.());
    }
  }, [file]);

  return (
    <PageWrapper>
      <StorageUploadCard resetRef={resetRef} setFile={setFile} />
      {isLoading ? (
        <Flex align={'center'} justify={'center'}>
          <Loader color={theme.colors.myBlue[2]} />
        </Flex>
      ) : uploadedFiles.length ? (
        <StorageFiles
          isLoading={isLoading}
          handleDeleteUploadedFile={handleDeleteUploadedFile}
          uploadedFiles={uploadedFiles}
        />
      ) : null}
      <StorageHistory />
    </PageWrapper>
  );
};

export default StoragePage;
