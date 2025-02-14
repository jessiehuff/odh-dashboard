import * as React from 'react';
import {
  Alert,
  Button,
  Flex,
  FlexItem,
  Modal,
  Stack,
  StackItem,
  TextInput,
} from '@patternfly/react-core';

type DeleteModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  deleting: boolean;
  onDelete: () => void;
  deleteName: string;
  submitButtonLabel?: string;
  error?: Error;
  children: React.ReactNode;
  testId?: string;
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  children,
  title,
  isOpen,
  onClose,
  deleting,
  onDelete,
  deleteName,
  error,
  submitButtonLabel = 'Delete',
  testId,
}) => {
  const [value, setValue] = React.useState('');

  const deleteNameSanitized = React.useMemo(
    () => deleteName.trim().replace(/\s+/g, ' '),
    [deleteName],
  );

  const onBeforeClose = (deleted: boolean) => {
    if (deleted) {
      onDelete();
    } else {
      onClose();
    }
  };

  React.useEffect(() => {
    if (!isOpen) {
      setValue('');
    }
  }, [isOpen]);

  return (
    <Modal
      title={title}
      titleIconVariant="warning"
      isOpen={isOpen}
      onClose={() => onBeforeClose(false)}
      actions={[
        <Button
          key="delete-button"
          variant="danger"
          isLoading={deleting}
          isDisabled={deleting || value.trim() !== deleteNameSanitized}
          onClick={() => onBeforeClose(true)}
        >
          {submitButtonLabel}
        </Button>,
        <Button key="cancel-button" variant="secondary" onClick={() => onBeforeClose(false)}>
          Cancel
        </Button>,
      ]}
      variant="small"
      data-testid={testId || 'delete-modal'}
    >
      <Stack hasGutter>
        <StackItem>{children}</StackItem>

        <StackItem>
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
            <FlexItem>
              Type <strong>{deleteNameSanitized}</strong> to confirm deletion:
            </FlexItem>

            <TextInput
              id="delete-modal-input"
              data-testid="delete-modal-input"
              aria-label="Delete modal input"
              value={value}
              onChange={(_e, newValue) => setValue(newValue)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && value.trim() === deleteNameSanitized && !deleting) {
                  onDelete();
                }
              }}
            />
          </Flex>
        </StackItem>

        {error && (
          <StackItem>
            <Alert title={`Error deleting ${deleteNameSanitized}`} isInline variant="danger">
              {error.message}
            </Alert>
          </StackItem>
        )}
      </Stack>
    </Modal>
  );
};

export default DeleteModal;
