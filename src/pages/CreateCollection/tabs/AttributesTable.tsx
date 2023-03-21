import { ReactNode, useCallback, VFC } from 'react';
import styled from 'styled-components';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { InputText, Select, TableColumnProps } from '@unique-nft/ui-kit';

import { Button, Icon, Table, TooltipWrapper } from '@app/components';
import { FORM_ERRORS } from '@app/pages/constants';

import { EnumsInputController } from '../components/EnumsInput/EnumsInputController';
import trash from '../../../static/icons/trash.svg';
import { rules, types } from '../constants';

interface AttributesTableProps {
  className?: string;
}

const ColumnTitle: VFC<{ title: string; tooltip: ReactNode }> = ({ title, tooltip }) => (
  <TableTitle>
    {title}
    <TooltipWrapper message={tooltip}>
      <Icon name="question" size={18} color="var(--color-primary-500)" />
    </TooltipWrapper>
  </TableTitle>
);

const PossibleValuesCell: VFC<{ index: number }> = ({ index }) => {
  const type = useWatch({ name: `attributes.${index}.type` } as any);

  return (
    <EnumsInputController
      rules={{
        required: {
          value: type.id !== 'string',
          message: FORM_ERRORS.REQUIRED_FIELDS,
        },
      }}
      defaultValue={null}
      isDisabled={type.id === 'string'}
      name={`attributes.${index}.values`}
      maxSymbols={40}
      getValues={(values) => values?.map((val) => val)}
    />
  );
};

const attributesColumns: TableColumnProps[] = [
  {
    width: '21%',
    field: 'name',
    title: (
      <ColumnTitle
        title="Attribute*"
        tooltip={<>Textual traits that show up&nbsp;on&nbsp;Token</>}
      />
    ),
    render(data, attribute, { rowIndex }) {
      const inputRegExp = /^[^0-9].*$|^$/;

      return (
        <Controller
          name={`attributes.${rowIndex}.name`}
          rules={{
            required: {
              value: true,
              message: FORM_ERRORS.REQUIRED_FIELDS,
            },
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
      <ColumnTitle
        title="Type"
        tooltip={<>Select type of&nbsp;information you want to&nbsp;create</>}
      />
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
    title: <ColumnTitle title="Rule" tooltip={<>Set a&nbsp;rule for your attribute</>} />,
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
        title="Possible values*"
        tooltip="Write down all the options you have"
      />
    ),
    render: (data, attribute, { rowIndex }) => <PossibleValuesCell index={rowIndex} />,
  },
  {
    title: '',
    width: '5%',
    field: 'id',
    render: (data, attribute, { rowIndex }) => (
      <Button
        title=""
        role="ghost"
        iconLeft={{ file: trash, size: 24 }}
        onClick={() => attribute.remove(rowIndex)}
      />
    ),
  },
];

const AttributesTableComponent: VFC<AttributesTableProps> = ({ className }) => {
  const { fields, append, remove } = useFieldArray({
    name: 'attributes',
    keyName: 'key',
    rules: {
      required: false,
    },
  });
  const advancedFields = fields.map((f) => ({ ...f, remove }));

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
      <Table data={advancedFields} noDataMessage={null} columns={attributesColumns} />
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

const TableTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: var(--prop-gap);

  @media screen and (min-width: 1024px) {
    margin-bottom: 0;
  }
`;

const AddButtonWrapper = styled.div`
  @media screen and (min-width: 1024px) {
    margin-top: var(--prop-gap);
  }

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
    .unique-table-data-row {
      padding-top: calc(var(--prop-gap) / 4);
      padding-bottom: calc(var(--prop-gap) / 4);

      & > div > button {
        height: 32px;
      }
    }

    .unique-input-text input,
    .unique-select .select-value {
      font-size: var(--prop-font-size);
      padding: 5px 8px;
      height: 20px;
    }

    .unique-select .select-value {
      padding: 5px 24px 5px 8px;
    }

    .enum-input .enum-input--input {
      font-size: var(--prop-font-size);
      padding: 5px 8px;
      line-height: 1.5;
      min-height: 22px;
    }

    .unique-input-text,
    .input-wrapper,
    .unique-select,
    .select-wrapper,
    .unique-button,
    .enum-input .enum-input--input {
      padding: 0;
    }

    .unique-select {
      width: 100%;

      .icon.icon-triangle {
        margin: 12px;
      }
    }
  }

  .mobile-table {
    .mobile-table-row {
      border-bottom: 1px solid #ececec;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: calc(var(--prop-gap) * 2);

      &:last-child {
        margin-bottom: calc(var(--prop-gap) * 1.5);
      }

      & > .mobile-table-cell {
        box-sizing: border-box;
        flex: 0 0 100%;
        padding-bottom: calc(var(--prop-gap) * 1.5);

        &:nth-child(2),
        &:nth-child(3) {
          flex: 0 1 50%;
          width: 50%;
        }

        &:nth-child(2) {
          padding-right: calc(var(--prop-gap) / 4);
        }

        &:nth-child(3) {
          padding-left: calc(var(--prop-gap) / 4);
        }

        &:last-child {
          display: block;

          .unique-button {
            height: auto;
            padding: 0;
          }
        }
      }
    }
  }
`;
