import * as React from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Spinner,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { CubesIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import PipelineRunTable from '~/concepts/pipelines/content/tables/pipelineRun/PipelineRunTable';
import { usePipelineArchivedRunsTable } from '~/concepts/pipelines/content/tables/pipelineRun/usePipelineRunTable';
import { PipelineRunType } from './types';

export const ArchivedRuns: React.FC = () => {
  const [[{ items: runs, totalSize }, loaded, error], { initialLoaded, ...tableProps }] =
    usePipelineArchivedRunsTable();

  if (error) {
    return (
      <Bullseye>
        <EmptyState>
          <EmptyStateHeader
            titleText="There was an issue loading archived runs"
            icon={<EmptyStateIcon icon={ExclamationCircleIcon} />}
            headingLevel="h2"
          />
          <EmptyStateBody>{error.message}</EmptyStateBody>
        </EmptyState>
      </Bullseye>
    );
  }

  if (!loaded && !initialLoaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (loaded && totalSize === 0 && !tableProps.filter) {
    return (
      <EmptyState data-testid="archived-runs-empty-state">
        <EmptyStateHeader
          titleText="No archived runs"
          icon={<EmptyStateIcon icon={CubesIcon} />}
          headingLevel="h2"
        />

        <EmptyStateBody>
          Archive a run before you delete it. Archived runs can be restored later.
        </EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <PipelineRunTable
      runs={runs}
      loading={!loaded}
      totalSize={totalSize}
      runType={PipelineRunType.Archived}
      {...tableProps}
    />
  );
};
