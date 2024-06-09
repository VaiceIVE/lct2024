import { Flex, Stack } from '@mantine/core';
import styles from './LoginPage.module.scss';
import { Drawer } from 'shared/ui/Drawer';
import { Input } from 'shared/ui/Input';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'shared/ui/Button';
import { useContext } from 'react';
import { Context } from 'main';
import { useNavigate } from 'react-router-dom';
import { HOME_ROUTE } from 'shared/constants/const';

const LoginPage = () => {
  const { UStore } = useContext(Context);

  const { control, watch, handleSubmit } = useForm();

  const navigate = useNavigate();

  const handleLogin = handleSubmit(({ username, password }) => {
    UStore.login(username, password);
  });

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
};

export default LoginPage;
