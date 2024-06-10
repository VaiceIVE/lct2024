import { Flex, Loader, useMantineTheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IFile } from 'shared/models/IFiles';
import FileServices from 'shared/services/FilesServices';

import { PageWrapper } from 'shared/ui/Wrappers/PageWrapper';
import { StorageFiles } from 'widgets/storage-files';
import { StorageHistory } from 'widgets/storage-history';
import { StorageUploadCard } from 'widgets/storage-upload-card';

const StoragePage = () => {
  const theme = useMantineTheme();

  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<IFile[]>([]);

  const [isLoading, setLoading] = useState(true);

  const getUploadedFiles = () => {
    FileServices.getUploadedFiles()
      .then((response) => setUploadedFiles(response.data))
      .finally(() => setLoading(false));
  };

  const handleDeleteUploadedFile = (id: number) => {
    FileServices.deleteFile(id).then(() => {
      getUploadedFiles();
    });
    setLoading(false);
  };

  useEffect(() => {
    getUploadedFiles();
  }, []);

  useEffect(() => {
    if (file) {
      FileServices.uploadFile(file).then(() => {
        getUploadedFiles();
      });
    }
  }, [file]);

  return (
    <PageWrapper>
      <StorageUploadCard setFile={setFile} />
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
