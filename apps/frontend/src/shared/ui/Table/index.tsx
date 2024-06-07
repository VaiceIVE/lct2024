import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import 'mantine-react-table/styles.css';
import {
  type MRT_ColumnDef,
  MantineReactTable,
  useMantineReactTable,
} from 'mantine-react-table';

import { Drawer } from '../Drawer';
import { IconBlock } from '../IconBlock';

import styles from './Table.module.scss';
import { ObjectCard } from './components/ObjectCard';

type test = {
  type: string;
  address: string;
  chance: number;
  date: string;
  event: string;
  cooling: string;
};

interface Props {
  data: test[];
}

export const Table = ({ data }: Props) => {
  const theme = useMantineTheme();

  const [opened, { open, close }] = useDisclosure(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedId || selectedId === 0) {
      open();
    }
  }, [selectedId, open]);

  useEffect(() => {
    if (!opened) {
      setSelectedId(null);
    }
  }, [opened]);

  const columns = useMemo<MRT_ColumnDef<test>[]>(
    () => [
      {
        accessorKey: 'type',
        header: 'Тип',
        size: 64,
        grow: false,
        enableSorting: false,
        Cell: ({ renderedCellValue }) => (
          <IconBlock iconType={`${renderedCellValue}`} />
        ),
      },
      {
        accessorKey: 'address',
        header: 'Адрес',
        size: 361,
        enableSorting: false,
        Cell: ({ renderedCellValue }) => (
          <div className={styles.address}>{renderedCellValue}</div>
        ),
        mantineTableBodyCellProps: {
          style: {
            maxWidth: '398px',
          },
        },
      },
      {
        accessorKey: 'chance',
        header: 'Вероятность',
        size: 172,
        Cell: ({ renderedCellValue }) => (
          <div
            className={classNames(
              styles.chance,
              renderedCellValue && +renderedCellValue < 80
                ? +renderedCellValue < 50
                  ? styles.gray
                  : styles.blue
                : styles.orange
            )}
          >
            {renderedCellValue}%
          </div>
        ),
        Header: () => <div className={styles.header}>Вероятность</div>,
        mantineTableHeadCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'date',
        header: 'Дата',
        size: 110,
        grow: false,
        Cell: ({ renderedCellValue }) => (
          <div className={styles.center}>{renderedCellValue}</div>
        ),
        mantineTableHeadCellProps: {
          align: 'center',
        },
        Header: () => <div className={styles.header}>Дата</div>,
      },
      {
        accessorKey: 'event',
        header: 'Событие',
        Header: () => <div className={styles.header}>Событие</div>,
        size: 200,
      },
      {
        accessorKey: 'cooling',
        header: 'Остывание',
        Header: () => <div className={styles.header}>Остывание</div>,
        size: 159,
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: data,
    enableColumnActions: false,
    enableTopToolbar: false,
    enableRowNumbers: true,
    enableSorting: true,
    enablePagination: true,
    positionPagination: 'bottom',
    paginationDisplayMode: 'pages',
    renderEmptyRowsFallback: () => (
      <div className={styles.empty}>Ничего не найдено</div>
    ),
    mantineTableHeadCellProps: {
      p: 20,
    },
    mantinePaperProps: {
      shadow: 'none',
      withBorder: false,
    },
    mantineTableProps: {
      className: styles.table,
      highlightOnHover: false,
      striped: 'even',
      stripedColor: '#F6F6F6',
      withColumnBorders: false,
      withRowBorders: false,
      withTableBorder: true,
      style: {
        background: theme.colors.myBlack[4],
        borderRadius: '12px',
        border: '1px solid #F6F6F6',
      },
    },
    mantinePaginationProps: {
      h: 42,
      showRowsPerPage: false,
      gap: 8,
    },
    mantineBottomToolbarProps: {
      className: styles.toolbar,
      style: {
        border: 'none',
      },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setSelectedId(+row.id);
      },
      style: {
        cursor: 'pointer',
      },
    }),
  });

  return (
    <div className={styles.wrapper}>
      <Drawer title="Карточка объекта" opened={opened} close={close}>
        <ObjectCard selectedId={selectedId} />
      </Drawer>
      <MantineReactTable table={table} />
    </div>
  );
};
