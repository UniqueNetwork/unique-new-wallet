import React, { createRef, useCallback, VFC } from 'react';
import {
  Button,
  Icon,
  InputText,
  Select,
  TableColumnProps,
  Tooltip,
} from '@unique-nft/ui-kit';
import styled from 'styled-components';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';

import { Table } from '@app/components';

import { EnumsInputController } from '../components/EnumsInput/EnumsInputController';
import trash from '../../../static/icons/trash.svg';
import { rules, types } from '../constants';

interface AttributesTableProps {
  className?: string;
}

const ColumnTitle: VFC<{ title: string; tooltip: string }> = ({ title, tooltip }) => {
  const valuesTooltip = createRef<HTMLDivElement>();

  return (
    <span>
      {title}
      <Tooltip targetRef={valuesTooltip}>{tooltip}</Tooltip>
      <Icon
        ref={valuesTooltip}
        name="question"
        size={18}
        color="var(--color-primary-500)"
      />
    </span>
  );
};

const PossibleValuesCell: VFC<{ index: number }> = ({ index }) => {
  const type = useWatch({ name: `attributes.${index}.type` } as any);

  return (
    <EnumsInputController
      rules={{
        required: type.id !== 'string',
      }}
      defaultValue={null}
      isDisabled={type.id === 'string'}
      name={`attributes.${index}.values`}
      maxSymbols={40}
      getValues={(values) => values?.map((val) => val)}
    />
  );
};

const DeleteRowCell: VFC<{ index: number }> = ({ index }) => {
  const { remove } = useFieldArray({ name: 'attributes' });

  return (
    <Button
      title=""
      role="ghost"
      iconLeft={{ file: trash, size: 24 }}
      onClick={() => remove(index)}
    />
  );
};

const attributesColumns: TableColumnProps[] = [
  {
    width: '21%',
    field: 'name',
    title: (
      <ColumnTitle title="Attribute" tooltip="Textual traits that show up on Token" />
    ),
    render(data, attribute, { rowIndex }) {
      const inputRegExp = /^[^0-9].*$|^$/;

      return (
        <Controller
          name={`attributes.${rowIndex}.name`}
          rules={{
            required: true,
          }}
          render={({ field: { value, onChange } }) => (
            <InputText
              value={value}
              placeholder="Attribute name"
              onChange={(value) => {
                if (inputRegExp.test(value)) {
                  onChange(value);
                }
              }}
            />
          )}
        />
      );
    },
  },
  {
    width: '17%',
    field: 'fieldType',
    title: (
      <ColumnTitle title="Type" tooltip="Select type of information you want to create" />
    ),
    render: (data, attribute, { rowIndex }) => (
      <Controller
        name={`attributes.${rowIndex}.type`}
        rules={{
          deps: `attributes.${rowIndex}.values`,
        }}
        render={({ field: { value, onChange } }) => (
          <Select
            value={value?.id}
            placeholder="Type"
            options={types}
            onChange={onChange}
          />
        )}
      />
    ),
  },
  {
    width: '17%',
    field: 'rule',
    title: <ColumnTitle title="Rule" tooltip="Set a rule for your attribute" />,
    render: (data, attribute, { rowIndex }) => (
      <Controller
        name={`attributes.${rowIndex}.optional`}
        render={({ field: { value, onChange } }) => (
          <Select
            value={value?.id}
            placeholder="Rule"
            options={rules}
            onChange={onChange}
          />
        )}
      />
    ),
  },
  {
    width: '40%',
    field: 'values',
    title: (
      <ColumnTitle
        title="Possible values"
        tooltip="Write down all the options you have"
      />
    ),
    render: (data, attribute, { rowIndex }) => <PossibleValuesCell index={rowIndex} />,
  },
  {
    title: '',
    width: '5%',
    field: 'id',
    render: (data, attribute, { rowIndex }) => <DeleteRowCell index={rowIndex} />,
  },
];

const AttributesTableComponent: VFC<AttributesTableProps> = ({ className }) => {
  const { fields, append } = useFieldArray({
    name: 'attributes',
  });

  const addAttributeHandler = useCallback(() => {
    append({
      name: '',
      type: { id: 'string', title: 'Text' },
      optional: { id: 'optional', title: 'Optional' },
      values: [],
    });
  }, []);

  return (
    <div className={className}>
      <Table data={fields} noDataMessage={null} columns={attributesColumns} />
      <AddButtonWrapper>
        <Button
          role="ghost"
          title="Add field"
          iconRight={{ name: 'plus', size: 16, color: 'var(--color-primary-500)' }}
          onClick={addAttributeHandler}
        />
      </AddButtonWrapper>
    </div>
  );
};

const AddButtonWrapper = styled.div`
  margin-top: var(--prop-gap);

  & > button.unique-button.ghost {
    background-color: transparent;
    border: none;
    color: var(--color-primary-500);
    padding: 0;
  }
`;

export const AttributesTable = styled(AttributesTableComponent)`
  margin-bottom: calc(var(--prop-gap) * 2.5);

  .unique-table {
    .unique-table-header {
      .table-header-cell {
        & > span {
          flex: 1 1 auto;
          padding-left: calc(var(--prop-gap) / 2);
          padding-right: calc(var(--prop-gap) / 2);

          .icon {
            display: inline-block;
            vertical-align: middle;
            margin: -0.125em 0 0 0.2em;
          }
        }
      }
    }

    .unique-table-data-row {
      & > div {
        padding-top: calc(var(--prop-gap) / 4);
        padding-bottom: calc(var(--prop-gap) / 4);
      }
    }

    .unique-input-text {
      &,
      .input-wrapper {
        padding: 0;
      }
    }

    .unique-select {
      width: 100%;

      &,
      .select-wrapper {
        padding: 0;
      }
    }

    .unique-button {
      padding: 0;
    }
  }
`;
