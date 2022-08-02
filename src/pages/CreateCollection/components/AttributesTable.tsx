import React, { createRef, VFC } from 'react';
import {
  Button,
  Icon,
  InputText,
  Select,
  SelectOptionProps,
  TableColumnProps,
  Tooltip,
} from '@unique-nft/ui-kit';
import styled from 'styled-components';
import { FieldArrayWithId } from 'react-hook-form';

import { Table } from '@app/components';
import {
  ArtificialAttributeItemType,
  ArtificialFieldType,
  FieldRuleType,
} from '@app/types';
import { InputController } from '@app/components/FormControllerComponents';
import { SelectController } from '@app/components/FormControllerComponents/SelectController';

import { EnumsInputController } from './EnumsInput/EnumsInputController';
import trash from '../../../static/icons/trash.svg';
import { AttributeField } from '../types';
import { rules, types } from '../constants';

interface AttributesTableProps {
  className?: string;
  value: FieldArrayWithId<AttributeField>[];
  onAddAttribute: () => void;
  onRemoveAttribute: (id: string) => void;
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

const getAttributesColumns = ({
  value,
  onRemoveAttribute,
}: AttributesTableProps): TableColumnProps[] => [
  {
    width: '21%',
    field: 'name',
    title: (
      <ColumnTitle title="Attribute" tooltip="Textual traits that show up on Token" />
    ),
    render(_, attribute: FieldArrayWithId<AttributeField>) {
      console.log(attribute);

      const attrIndex = value.findIndex((f) => f.id === attribute.id);
      return (
        <InputController
          rules={{
            required: true,
          }}
          name={`attributes.${attrIndex}.name`}
          placeholder="Attribute name"
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
    render(_, attribute: FieldArrayWithId<AttributeField>) {
      const attrIndex = value.findIndex((f) => f.id === attribute.id);
      return (
        <SelectController
          name={`attributes.${attrIndex}.type`}
          placeholder="Type"
          options={types}
        />
      );
    },
  },
  {
    width: '17%',
    field: 'rule',
    title: <ColumnTitle title="Rule" tooltip="Set a rule for your attribute" />,
    render(_, attribute: FieldArrayWithId<AttributeField>) {
      const attrIndex = value.findIndex((f) => f.id === attribute.id);

      return (
        <SelectController
          name={`attributes.${attrIndex}.optional`}
          placeholder="Rule"
          options={rules}
        />
      );
    },
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
    render(values: string[], attribute: FieldArrayWithId<AttributeField>) {
      const attrIndex = value.findIndex((f) => f.id === attribute.id);
      const row = value[attrIndex];
      console.log('test');
      console.log(row);

      return (
        <EnumsInputController
          isDisabled={(row as any).type.id === 'string'}
          name={`attributes.${attrIndex}.values`}
          maxSymbols={40}
          defaultValue={[]}
          getValues={(values) => values?.map((val) => val)}
        />
      );
    },
  },
  {
    title: '',
    width: '5%',
    field: 'id',
    render(id: string, attribute: ArtificialAttributeItemType) {
      return (
        <Button
          title=""
          role="ghost"
          iconLeft={{ file: trash, size: 24 }}
          onClick={() => onRemoveAttribute(id)}
        />
      );
    },
  },
];

const AttributesTableComponent: VFC<AttributesTableProps> = (props) => {
  const { className, value, onAddAttribute } = props;
  return (
    <div className={className}>
      <Table data={value} noDataMessage={null} columns={getAttributesColumns(props)} />
      <AddButtonWrapper>
        <Button
          role="ghost"
          title="Add field"
          iconRight={{ name: 'plus', size: 16, color: 'var(--color-primary-500)' }}
          onClick={onAddAttribute}
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
