<script lang="ts">
  import svg from 'bootstrap-icons/bootstrap-icons.svg';

  export let icon: string;
  export let size = 24;
</script>

<svg class="bi" width={size} height={size} fill="currentColor">
  <use xlink:href="{svg}#{icon}" />
</svg>
