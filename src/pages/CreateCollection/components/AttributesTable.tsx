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
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Table } from '@app/components';
import {
  ArtificialAttributeItemType,
  // ArtificialFieldRuleType,
  ArtificialFieldType,
  FieldRuleType,
} from '@app/types';
import { InputController } from '@app/components/FormControllerComponents';
import { SelectController } from '@app/components/FormControllerComponents/SelectController';

import { EnumsInputController } from './EnumsInput/EnumsInputController';
import trash from '../../../static/icons/trash.svg';

interface AttributesTableProps {
  className?: string;
  value: ArtificialAttributeItemType[];
  onAddAttribute: () => void;
  onRemoveAttribute: (id: string) => void;
  onChangeAttributeType: (id: string, fieldType: FieldTypeOption) => void;
}

export type FieldTypeOption = SelectOptionProps & { key: ArtificialFieldType };
const fieldTypeOptions: FieldTypeOption[] = [
  { key: 'string', value: 'Text' },
  { key: 'enum', value: 'Select' },
  { key: 'repeated', value: 'Multiselect' },
];

type FieldRuleOption = SelectOptionProps & { key: string };

const fieldRuleOptions: FieldRuleOption[] = [
  { key: 'true', value: 'Optional' },
  { key: 'false', value: 'Required' },
];

const EnumsValuesAttribute = () => {
  const { control } = useFormContext();
  const enumValuesFields = useFieldArray({
    control,
    name: `attributes.${0}.enumValues`,
  });
  return (
    <EnumsInputController<{ _: string }>
      // isDisabled={attribute.fieldType === 'string'}
      name={`attributes.${0}.enumValues`}
      maxSymbols={40}
      defaultValue={[]}
      getValues={(values) => values.map((val) => val._)}
      onAdd={(value) => {
        enumValuesFields.append({ _: value });
      }}
      onDelete={(index) => {
        enumValuesFields.remove(index);
      }}
    />
  );
};

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
  onChangeAttributeType,
}: AttributesTableProps): TableColumnProps[] => [
  {
    width: '21%',
    field: 'name',
    title: (
      <ColumnTitle title="Attribute" tooltip="Textual traits that show up on Token" />
    ),
    render(name: string, attribute: ArtificialAttributeItemType) {
      const attrIndex = value.findIndex((f) => f.id === attribute.id);
      return (
        <InputController
          name={`attributes.${attrIndex}.name._`}
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
    render(type: ArtificialFieldType, attribute: ArtificialAttributeItemType) {
      return (
        <Select
          placeholder="Type"
          options={fieldTypeOptions}
          optionKey="key"
          optionValue="value"
          value={type}
          onChange={(option: FieldTypeOption) => {
            onChangeAttributeType(attribute.id, option);
          }}
        />
      );
    },
  },
  {
    width: '17%',
    field: 'rule',
    title: <ColumnTitle title="Rule" tooltip="Set a rule for your attribute" />,
    render(rule: FieldRuleType, attribute: ArtificialAttributeItemType) {
      const attrIndex = value.findIndex((f) => f.id === attribute.id);

      return (
        <SelectController
          name={`attributes.${attrIndex}.optional`}
          placeholder="Rule"
          optionKey="key"
          optionValue="value"
          options={fieldRuleOptions}
          transform={{
            input: (val: boolean) => {
              return fieldRuleOptions.find((f) => JSON.parse(f.key) === val)?.key;
            },
            output: (val: FieldRuleOption) => {
              return JSON.parse(val.key);
            },
          }}
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
    render(values: string[], attribute: ArtificialAttributeItemType) {
      // console.log('VALUES');
      // console.log(values);
      // console.log(attribute);

      return <EnumsValuesAttribute />;
    },
  },
  {
    title: '',
    width: '5%',
    field: 'id',
    render(id: string, attribute: ArtificialAttributeItemType) {
      // console.log('attribute');
      // console.log(id);
      // console.log(attribute);

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
  const { className, value, onAddAttribute, onRemoveAttribute } = props;
  // console.log('data');
  // console.log(value);

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
