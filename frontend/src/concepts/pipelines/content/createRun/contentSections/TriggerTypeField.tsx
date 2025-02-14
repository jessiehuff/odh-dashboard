import * as React from 'react';
import {
  ClipboardCopy,
  FormGroup,
  Split,
  SplitItem,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import SimpleDropdownSelect from '~/components/SimpleDropdownSelect';
import {
  PeriodicOptions,
  RunTypeScheduledData,
  ScheduledType,
} from '~/concepts/pipelines/content/createRun/types';
import NumberInputWrapper from '~/components/NumberInputWrapper';
import { replaceNonNumericPartWithString, replaceNumericPartWithString } from '~/utilities/string';
import {
  DEFAULT_CRON_STRING,
  DEFAULT_PERIODIC_OPTION,
} from '~/concepts/pipelines/content/createRun/const';

type TriggerTypeFieldProps = {
  data: RunTypeScheduledData;
  onChange: (scheduledData: RunTypeScheduledData) => void;
};

const TriggerTypeField: React.FC<TriggerTypeFieldProps> = ({ data, onChange }) => {
  let content: React.ReactNode | null;
  switch (data.triggerType) {
    case ScheduledType.CRON:
      content = (
        <FormGroup label="Cron string">
          <ClipboardCopy
            hoverTip="Copy"
            clickTip="Copied"
            onChange={(e, value) => {
              if (typeof value === 'string') {
                onChange({ ...data, value });
              }
            }}
          >
            {data.value}
          </ClipboardCopy>
        </FormGroup>
      );
      break;
    case ScheduledType.PERIODIC:
      content = (
        <FormGroup label="Run every">
          <Split hasGutter>
            <SplitItem>
              <NumberInputWrapper
                min={1}
                value={parseInt(data.value) || 1}
                onChange={(value) =>
                  onChange({
                    ...data,
                    value: replaceNumericPartWithString(data.value, value),
                  })
                }
              />
            </SplitItem>
            <SplitItem>
              <SimpleDropdownSelect
                options={Object.values(PeriodicOptions).map((v) => ({
                  key: v,
                  label: v,
                }))}
                value={data.value.replace(/\d+/, '')}
                onChange={(value) =>
                  onChange({
                    ...data,
                    value: replaceNonNumericPartWithString(data.value, value),
                  })
                }
              />
            </SplitItem>
          </Split>
        </FormGroup>
      );
      break;
    default:
      content = null;
  }

  return (
    <Stack hasGutter>
      <StackItem>
        <FormGroup label="Trigger type">
          <SimpleDropdownSelect
            data-testid="triggerTypeSelector"
            isFullWidth
            options={[
              { key: ScheduledType.PERIODIC, label: 'Periodic' },
              { key: ScheduledType.CRON, label: 'Cron' },
            ]}
            value={data.triggerType}
            onChange={(triggerTypeString) => {
              let triggerType: ScheduledType;
              let value: string;

              switch (triggerTypeString) {
                case ScheduledType.CRON:
                  triggerType = ScheduledType.CRON;
                  value = DEFAULT_CRON_STRING;
                  break;
                case ScheduledType.PERIODIC:
                  triggerType = ScheduledType.PERIODIC;
                  value = DEFAULT_PERIODIC_OPTION;
                  break;
                default:
                  return;
              }

              onChange({ ...data, triggerType, value });
            }}
          />
        </FormGroup>
      </StackItem>
      {content && <StackItem>{content}</StackItem>}
    </Stack>
  );
};

export default TriggerTypeField;
