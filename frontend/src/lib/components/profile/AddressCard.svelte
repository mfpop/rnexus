<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { toast } from 'svelte-sonner';

  export let user: any;

  let address: any = {};
  let originalAddress: any = {};
  let editMode = false;

  onMount(() => {
    if (user && user.address) {
      address = { ...user.address };
      originalAddress = { ...user.address };
    }
  });

  function handleSave() {
    // Here you would typically save the address to your backend
    console.log('Saving address:', address);
    originalAddress = { ...address };
    editMode = false;
    toast.success('Address saved successfully!');
  }

  function handleCancel() {
    address = { ...originalAddress };
    editMode = false;
  }
</script>

<Card.Root class="w-full">
  <Card.Header>
    <Card.Title>Address</Card.Title>
    <Card.Description>Your primary address.</Card.Description>
  </Card.Header>
  <Card.Content>
    {#if editMode}
      <div class="grid gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="street">Street</Label>
            <Input id="street" bind:value={address.street} placeholder="Enter your street" />
          </div>
          <div class="grid gap-2">
            <Label for="city">City</Label>
            <Input id="city" bind:value={address.city} placeholder="Enter your city" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="state">State</Label>
            <Input id="state" bind:value={address.state} placeholder="Enter your state" />
          </div>
          <div class="grid gap-2">
            <Label for="zip">Zip Code</Label>
            <Input id="zip" bind:value={address.zipCode} placeholder="Enter your zip code" />
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="country">Country</Label>
          <Input id="country" bind:value={address.country} placeholder="Enter your country" />
        </div>
      </div>
    {:else}
      <div class="grid gap-2 text-sm">
        <div class="grid grid-cols-[100px_1fr] items-center">
          <span class="font-semibold">Street:</span>
          <span>{address.street || 'N/A'}</span>
        </div>
        <div class="grid grid-cols-[100px_1fr] items-center">
          <span class="font-semibold">City:</span>
          <span>{address.city || 'N/A'}</span>
        </div>
        <div class="grid grid-cols-[100px_1fr] items-center">
          <span class="font-semibold">State:</span>
          <span>{address.state || 'N/A'}</span>
        </div>
        <div class="grid grid-cols-[100px_1fr] items-center">
          <span class="font-semibold">Zip Code:</span>
          <span>{address.zipCode || 'N/A'}</span>
        </div>
        <div class="grid grid-cols-[100px_1fr] items-center">
          <span class="font-semibold">Country:</span>
          <span>{address.country || 'N/A'}</span>
        </div>
      </div>
    {/if}
  </Card.Content>
  <Card.Footer class="flex justify-end gap-2">
    {#if editMode}
      <Button on:click={handleCancel} variant="outline">Cancel</Button>
      <Button on:click={handleSave}>Save</Button>
    {:else}
      <Button on:click={() => (editMode = true)}>Edit</Button>
    {/if}
  </Card.Footer>
</Card.Root>
