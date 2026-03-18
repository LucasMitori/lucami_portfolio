<template>
    <div class="showcase-inputs">
        <h2 class="showcase-section-title">{{ t("components.inputs") }}</h2>

        <v-row>
            <v-col cols="12">
                <h3 class="showcase-group-title mb-4">Text Field Variants</h3>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-text-field
                    v-model="textValue"
                    label="Outlined"
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                    placeholder="Enter your name"
                />
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-text-field
                    label="Filled"
                    variant="filled"
                    prepend-inner-icon="mdi-email"
                    placeholder="Email address"
                />
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-text-field
                    label="Underlined"
                    variant="underlined"
                    prepend-inner-icon="mdi-phone"
                    placeholder="Phone number"
                />
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-text-field
                    label="Solo Filled"
                    variant="solo-filled"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="Search..."
                />
            </v-col>

            <v-col cols="12">
                <h3 class="showcase-group-title mb-4">Validation States</h3>
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field
                    model-value="valid@email.com"
                    label="Success State"
                    variant="outlined"
                    color="success"
                    prepend-inner-icon="mdi-check-circle"
                    messages="Email is valid"
                />
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field
                    model-value="invalid-email"
                    label="Error State"
                    variant="outlined"
                    error
                    error-messages="Please enter a valid email"
                    prepend-inner-icon="mdi-alert-circle"
                />
            </v-col>

            <v-col cols="12">
                <h3 class="showcase-group-title mb-4">Textarea</h3>
            </v-col>
            <v-col cols="12" sm="6">
                <v-textarea
                    label="Auto-grow Textarea"
                    variant="outlined"
                    auto-grow
                    rows="3"
                    placeholder="Type something here..."
                />
            </v-col>
            <v-col cols="12" sm="6">
                <v-textarea
                    label="Counter Textarea"
                    variant="outlined"
                    counter="200"
                    rows="3"
                    placeholder="Limited to 200 characters"
                />
            </v-col>

            <v-col cols="12">
                <h3 class="showcase-group-title mb-4">Select & Combobox</h3>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-select
                    v-model="selectValue"
                    :items="frameworks"
                    label="Select Framework"
                    variant="outlined"
                    prepend-inner-icon="mdi-code-tags"
                />
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-combobox
                    :items="frameworks"
                    label="Combobox (custom values)"
                    variant="outlined"
                    prepend-inner-icon="mdi-plus-circle"
                    clearable
                />
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                    :items="frameworks"
                    label="Autocomplete"
                    variant="outlined"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                />
            </v-col>

            <v-col cols="12">
                <h3 class="showcase-group-title mb-4">Toggles & Selections</h3>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-switch
                    v-model="switchValue"
                    label="Dark Mode"
                    color="primary"
                    inset
                />
                <v-switch
                    :model-value="true"
                    label="Notifications"
                    color="success"
                    inset
                />
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-checkbox
                    v-model="checkboxValue"
                    label="Accept Terms"
                    color="primary"
                />
                <v-checkbox
                    :model-value="true"
                    label="Remember Me"
                    color="secondary"
                />
                <v-checkbox indeterminate label="Select All" color="primary" />
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-radio-group v-model="radioValue" label="Priority">
                    <v-radio label="Low" value="low" color="success" />
                    <v-radio label="Medium" value="medium" color="warning" />
                    <v-radio label="High" value="high" color="error" />
                </v-radio-group>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-slider
                    v-model="sliderValue"
                    label="Volume"
                    color="primary"
                    thumb-label
                    step="1"
                    min="0"
                    max="100"
                    prepend-icon="mdi-volume-high"
                />
                <v-range-slider
                    v-model="rangeValue"
                    label="Price Range"
                    color="secondary"
                    thumb-label
                    step="10"
                    min="0"
                    max="1000"
                />
            </v-col>

            <v-col cols="12">
                <h3 class="showcase-group-title mb-4">File Input & Rating</h3>
            </v-col>
            <v-col cols="12" sm="6">
                <v-file-input
                    label="Upload File"
                    variant="outlined"
                    prepend-icon="mdi-paperclip"
                    accept="image/*"
                    show-size
                />
            </v-col>
            <v-col cols="12" sm="6">
                <div class="d-flex flex-column ga-2">
                    <span class="text-body-2 text-medium-emphasis">Rating</span>
                    <v-rating
                        v-model="ratingValue"
                        color="warning"
                        active-color="warning"
                        hover
                        half-increments
                    />
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const textValue = ref("");
const selectValue = ref("Vue.js");
const switchValue = ref(false);
const checkboxValue = ref(false);
const radioValue = ref("medium");
const sliderValue = ref(50);
const rangeValue = ref([200, 600]);
const ratingValue = ref(3.5);

const frameworks = [
    "Vue.js",
    "React",
    "Angular",
    "Svelte",
    "Nuxt",
    "Next.js",
    "Solid",
    "Astro",
];
</script>

<style scoped>
.showcase-inputs {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.showcase-section-title {
    font-size: 1.5rem;
    font-weight: 700;
    font-family: var(--font-heading);
    margin-bottom: 8px;
}

.showcase-group-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: rgb(var(--v-theme-primary));
    text-transform: uppercase;
    letter-spacing: 1px;
}
</style>
