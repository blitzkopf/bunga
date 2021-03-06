<template>
    <section>
        <b-field label="Simple indicator">
            <b-slider v-model="value1" indicator :tooltip="false" :max="10000" :format="format" :locale="locale"></b-slider>
        </b-field>
        <b-field label="Custom format (bypass locale)">
            <b-slider v-model="value2" :custom-formatter="(val) => val + '%'" :tooltip="false" indicator></b-slider>
        </b-field>
    </section>
</template>

<script>
    export default {
        name: 'Playbar',
        data() {
            return {
                format: "raw",
                locale: undefined, // Browser locale

                value1: 6000,
                value2: 40,
            }
        },
    }
</script>