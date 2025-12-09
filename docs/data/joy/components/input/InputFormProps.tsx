import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import * as React from 'react';

export default function InputFormProps() {
  return (
    <form
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const formJson = Object.fromEntries(formData.entries() as Iterable<[string, FormDataEntryValue]>);
        
        alert(JSON.stringify(formJson));
      }}
    >
      <Stack spacing={1}>
        <Input placeholder="Try to submit with no text!" required />
        <Input placeholder="It is disabled" disabled />
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}