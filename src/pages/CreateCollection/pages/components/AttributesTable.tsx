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
import { EnumsInputController } from '@app/pages/CreateCollection/pages/components/EnumsInput/EnumsInputController';

import { EnumsInput } from './EnumsInput';
import trash from '../../../../static/icons/trash.svg';

interface AttributesTableProps {
  className?: string;
  value: ArtificialAttributeItemType[];
  onChange: (value: ArtificialAttributeItemType[]) => void;
  onAddAttributeItem(): void;
}

interface AttributesColumnsProps {
  onAttributeChange(attribute: ArtificialAttributeItemType): void;
}

type FieldTypeOption = SelectOptionProps & { key: ArtificialFieldType };
const fieldTypeOptions: FieldTypeOption[] = [
  { key: 'string', value: 'Text' },
  { key: 'enum', value: 'Select' },
  { key: 'repeated', value: 'Multiselect' },
];

type FieldRuleOption = SelectOptionProps & { key: boolean };

const fieldRuleOptions: FieldRuleOption[] = [
  { key: true, value: 'Optional' },
  { key: false, value: 'Required' },
];

const attributeTooltip = createRef<HTMLDivElement>();
const typeTooltip = createRef<HTMLDivElement>();
const ruleTooltip = createRef<HTMLDivElement>();
const valuesTooltip = createRef<HTMLDivElement>();

const AttributeTitle = () => {
  return (
    <span>
      Attribute
      <Tooltip targetRef={attributeTooltip}>
        Textual traits that show up&nbsp;on&nbsp;Token
      </Tooltip>
      <Icon
        ref={attributeTooltip}
        name="question"
        size={18}
        color="var(--color-primary-500)"
      />
    </span>
  );
};

const TypeTitle = () => {
  return (
    <span>
      Type
      <Tooltip targetRef={typeTooltip}>
        Select type of&nbsp;information you want to&nbsp;create
      </Tooltip>
      <Icon
        ref={typeTooltip}
        name="question"
        size={18}
        color="var(--color-primary-500)"
      />
    </span>
  );
};

const RuleTitle = () => {
  return (
    <span>
      Rule
      <Tooltip targetRef={ruleTooltip}>Set a&nbsp;rule for your attribute</Tooltip>
      <Icon
        ref={ruleTooltip}
        name="question"
        size={18}
        color="var(--color-primary-500)"
      />
    </span>
  );
};

const ValuesTitle = () => {
  return (
    <span>
      Possible values
      <Tooltip targetRef={valuesTooltip}>Write down all the options you have</Tooltip>
      <Icon
        ref={valuesTooltip}
        name="question"
        size={18}
        color="var(--color-primary-500)"
      />
    </span>
  );
};

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

const getAttributesColumns = ({
  onAttributeChange,
}: AttributesColumnsProps): TableColumnProps[] => [
  {
    title: AttributeTitle(),
    width: '21%',
    field: 'name',
    render(name: string, attribute: ArtificialAttributeItemType) {
      return (
        <InputController name={`attributes.${0}.name._`} placeholder="Attribute name" />
      );
    },
  },
  {
    title: TypeTitle(),
    width: '17%',
    field: 'fieldType',
    render(type: ArtificialFieldType, attribute: ArtificialAttributeItemType) {
      // return (
      //   <Select
      //     placeholder="Type"
      //     options={fieldTypeOptions}
      //     optionKey="key"
      //     optionValue="value"
      //     value={type}
      //     onChange={(option) =>
      //       onAttributeChange({
      //         ...attribute,
      //         fieldType: (option as FieldTypeOption).key,
      //       })
      //     }
      //   />
      // );
      return <div>Title</div>;
    },
  },
  {
    title: RuleTitle(),
    width: '17%',
    field: 'rule',
    render(rule: FieldRuleType, attribute: ArtificialAttributeItemType) {
      return (
        <SelectController
          name={`attributes.${0}.optional`}
          placeholder="Rule"
          options={fieldRuleOptions}
          optionKey="key"
          optionValue="value"
        />
      );
    },
  },
  {
    title: ValuesTitle(),
    width: '40%',
    field: 'values',
    render(values: string[], attribute: ArtificialAttributeItemType) {
      return <EnumsValuesAttribute />;
    },
  },
  {
    title: '',
    width: '5%',
    field: 'id',
    render(id: number, attribute: ArtificialAttributeItemType) {
      return (
        <Button
          title=""
          role="ghost"
          iconLeft={{ file: trash, size: 24 }}
          // onClick={() => onRemoveAttributeClick(attribute)}
        />
      );
    },
  },
];

const AttributesTableComponent: VFC<AttributesTableProps> = ({
  className,
  value,
  onChange,
  onAddAttributeItem,
}) => {
  // const { control } = useFormContext();
  // const attributesArray = useFieldArray({
  //   control,
  //   name: 'attributes',
  // });

  // const onAttributeChange = (attribute: ArtificialAttributeItemType) => {
  //   onChange(value.map((item) => (item.id !== attribute.id ? item : attribute)));
  // };

  const onAttributeChange = (...args: any) => {
    console.log('onAttributeChange', args);
  };

  const onRemoveAttributeClick = (attribute: ArtificialAttributeItemType) => {
    onChange(value.filter((item) => item.id !== attribute.id));
  };

  return (
    <div className={className}>
      <Table
        data={value}
        columns={getAttributesColumns({ onAttributeChange })}
        noDataMessage={null}
      />
      <AddButtonWrapper>
        <Button
          role="ghost"
          title="Add field"
          iconRight={{ name: 'plus', size: 16, color: 'var(--color-primary-500)' }}
          onClick={onAddAttributeItem}
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
