<script lang="ts">
    export let object: object;
    export let title: string;
</script>

<style>
    div:not(:last-child) {
        margin-right: 10px;
    }

    td, th {
        padding-bottom: 0;
        padding-top: 0;
    }
</style>
<div>
    <table class="table">
        <caption>{title}</caption>
        <tbody>
        {#each Object.entries(object) as [key, value]}
            <tr>
                <th scope="row">{key}</th>
                <td>{value}</td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
