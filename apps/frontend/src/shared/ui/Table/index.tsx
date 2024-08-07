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
import { IBuilding } from 'shared/models/IBuilding';
import { ObjectInfo } from 'widgets/object-info';
import { Chance } from '../Chance';
import { IconChevronRight } from '@tabler/icons-react';
import dayjs from 'dayjs';

interface Props {
  data: IBuilding[];
  id: string | (string | null)[] | null;
  defaultMonth: string;
}

export const Table = ({ data, id, defaultMonth }: Props) => {
  const theme = useMantineTheme();

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(
    null
  );

  useEffect(() => {
    if (selectedBuilding) {
      open();
    }
  }, [selectedBuilding, open]);

  useEffect(() => {
    if (!opened) {
      setSelectedBuilding(null);
    }
  }, [opened]);

  const columns = useMemo<MRT_ColumnDef<IBuilding>[]>(
    () => [
      {
        accessorKey: 'socialType',
        header: 'Тип',
        size: 64,
        grow: false,
        enableSorting: false,
        Cell: ({ renderedCellValue }) => (
          <IconBlock
            tooltip={`${renderedCellValue}`}
            iconType={`${renderedCellValue}`}
          />
        ),
      },
      {
        accessorKey: 'address',
        header: 'Адрес',
        size: 361,
        enableSorting: false,
        Cell: ({ renderedCellValue }) => (
          <div className={styles.address}>
            {renderedCellValue}{' '}
            <IconChevronRight size={20} color={theme.colors.myBlue[1]} />
          </div>
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
        Cell: ({ row }) => (
          <div className={classNames(styles.chance)}>
            {row.original.events.length && (
              <Chance value={row.original.events[0].chance} />
            )}
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
        Cell: ({ row }) => (
          <div className={styles.center}>
            {row.original.events.length &&
              dayjs(row.original.events[0].date).format('DD.MM')}
          </div>
        ),
        mantineTableHeadCellProps: {
          align: 'center',
        },
        Header: () => <div className={styles.header}>Дата</div>,
      },
      {
        accessorKey: 'eventName',
        header: 'Событие',
        Header: () => <div className={styles.header}>Событие</div>,
        size: 200,
        Cell: ({ row }) => (
          <div className={styles.center}>
            {row.original.events.length && row.original.events[0].eventName}
          </div>
        ),
        mantineTableHeadCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'consumersCount',
        header: 'Потребители',
        Header: () => <div className={styles.header}>Потребители</div>,
        size: 159,
        Cell: ({ renderedCellValue }) => (
          <div>{renderedCellValue ? renderedCellValue : 1}</div>
        ),
      },
    ],
    [theme.colors.myBlue]
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
    pageCount: 25,
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
      showRowsPerPage: false,
      gap: 8,
      rowsPerPageOptions: ['10', '25'],
      withEdges: false,
    },
    mantineBottomToolbarProps: {
      className: styles.toolbar,
      style: {
        border: 'none',
      },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setSelectedBuilding(row?.original);
      },
      style: {
        cursor: 'pointer',
      },
    }),
  });

  return (
    <div className={styles.wrapper}>
      <Drawer isBlur title="Карточка объекта" opened={opened} close={close}>
        {selectedBuilding ? (
          <ObjectInfo
            defaultId={id}
            defaultMonth={defaultMonth}
            selectedObj={null}
            selectedBuilding={selectedBuilding}
          />
        ) : null}
      </Drawer>
      <MantineReactTable table={table} />
    </div>
  );
};
