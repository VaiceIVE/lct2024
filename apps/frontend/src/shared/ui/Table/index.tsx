import { useMemo } from 'react';
import classNames from 'classnames';
import { useMantineTheme } from '@mantine/core';

import 'mantine-react-table/styles.css';
import {
  type MRT_ColumnDef,
  MantineReactTable,
  useMantineReactTable,
} from 'mantine-react-table';

import styles from './Table.module.scss';
import { IconHome } from '@tabler/icons-react';

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

const typeIcons: { [key: string]: JSX.Element } = {
  '1': <IconHome width={24} height={24} className={styles.orange} />,
};

export const Table = ({ data }: Props) => {
  const theme = useMantineTheme();

  const columns = useMemo<MRT_ColumnDef<test>[]>(
    () => [
      {
        accessorKey: 'type',
        header: 'Тип',
        size: 64,
        grow: false,
        enableSorting: false,
        Cell: ({ renderedCellValue }) => (
          <div className={styles.type}>{typeIcons[`${renderedCellValue}`]}</div>
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
    mantinePaperProps: {
      shadow: 'none',
      withBorder: false,
    },
    mantineTableProps: {
      className: styles.table,
      highlightOnHover: false,
      striped: 'even',
      stripedColor: '#FAFAFA',
      withColumnBorders: false,
      withRowBorders: false,
      withTableBorder: false,
      style: {
        background: theme.colors.myBlack[4],
        borderRadius: '12px',
        outline: '1px solid #FAFAFA',
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
    paginationDisplayMode: 'pages',
  });

  return (
    <div className={styles.wrapper}>
      <MantineReactTable table={table} />
    </div>
  );
};
