import { Flex, Stack } from '@mantine/core';
import styles from './LoginPage.module.scss';
import { Drawer } from 'shared/ui/Drawer';
import { Input } from 'shared/ui/Input';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'shared/ui/Button';
import { useContext, useEffect, useState } from 'react';
import { Context } from 'main';
import { observer } from 'mobx-react-lite';

const LoginPage = observer(() => {
  const { UStore } = useContext(Context);

  const { control, watch, handleSubmit } = useForm();

  const username = watch('username') || '';
  const password = watch('password') || '';

  const [error, setError] = useState('');

  const handleLogin = handleSubmit(({ username, password }) => {
    UStore.login(username, password);
  });

  useEffect(() => {
    if (UStore.error) {
      UStore.setError('');
    }
  }, [UStore, username, password]);

  useEffect(() => {
    setError(UStore.error);
  }, [UStore.error]);

  return (
    <div className={styles.wrapper}>
      <Drawer
        title="Вход"
        close={() => null}
        opened
        backgroundOpacity={0}
        withCloseButton={false}
        isFooterBorder={false}
        footer={
          <Flex>
            <Button
              disabled={!watch('username') || !watch('password')}
              fullWidth
              label="Войти"
              onClick={handleLogin}
            />
          </Flex>
        }
      >
        <form>
          <Stack autoFocus={false} gap={20}>
            <Controller
              control={control}
              defaultValue={''}
              name="username"
              render={({ field }) => (
                <Input
                  error={error}
                  label="Логин"
                  placeholder="Введите логин"
                  field={field}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              defaultValue={''}
              render={({ field }) => (
                <Input
                  error={error}
                  type="password"
                  label="Пароль"
                  placeholder="Введите пароль"
                  field={field}
                />
              )}
            />
          </Stack>
        </form>
      </Drawer>
    </div>
  );
});

export default LoginPage;
