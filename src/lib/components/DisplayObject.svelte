<script lang="ts">
    import dayjs from "dayjs";

    type Props = {
        title: string;
        object: object;
    }
    let {title, object}: Props = $props();
</script>

<style>

    div:not(:last-child) {
        margin-right: 10px;
    }

    table td, table th {
        padding-bottom: 0;
        padding-top: 0;
    }

    caption {
        caption-side: top;
        padding-bottom: 10px;
        font-weight: bold;
    }

</style>
<div>
    <table class="table is-hoverable is-striped">
        <caption>{title}</caption>
        <tbody>
        {#each Object.entries(object) as [key, value]}
            <tr>
                <th scope="row">{key}</th>
                {#if ['exp', 'iat', 'auth_time'].includes(key)  }
                    <td data-text="{value}">{dayjs.unix(value).format('YYYY-MM-DDTHH:mm:ssZ[Z]')}</td>
                {:else}
                    <td>{value}</td>
                {/if}
            </tr>
        {/each}
        </tbody>
    </table>
</div>
