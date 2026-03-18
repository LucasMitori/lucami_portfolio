<template>
    <div class="admin-about-editor">
        <v-progress-linear v-if="loading" indeterminate class="mb-4" />

        <v-alert v-if="fetchError" type="error" class="mb-4" closable>
            Failed to load about content.
        </v-alert>

        <template v-if="about">
            <v-card class="mb-4">
                <v-card-title>
                    <v-icon start icon="mdi-account" />
                    Profile
                </v-card-title>
                <v-card-text>
                    <v-textarea
                        v-model="about.bio"
                        label="Bio (HTML)"
                        variant="outlined"
                        rows="5"
                        class="mb-3"
                    />
                    <v-alert type="info" variant="tonal" density="compact">
                        <template #text>
                            <span class="text-caption">
                                <strong>Profile Image:</strong> Place your
                                profile picture at
                                <code>public/media/profile.jpg</code>
                            </span>
                        </template>
                    </v-alert>
                </v-card-text>
            </v-card>

            <v-card class="mb-4">
                <v-card-title>
                    <v-icon start icon="mdi-map-marker" />
                    Location
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-text-field
                                v-model="about.location"
                                label="Location"
                                variant="outlined"
                                prepend-inner-icon="mdi-map-marker"
                            />
                        </v-col>
                        <v-col cols="6" sm="3">
                            <v-text-field
                                v-model.number="about.mapCoordinates.lat"
                                label="Latitude"
                                variant="outlined"
                                type="number"
                                step="0.0001"
                            />
                        </v-col>
                        <v-col cols="6" sm="3">
                            <v-text-field
                                v-model.number="about.mapCoordinates.lng"
                                label="Longitude"
                                variant="outlined"
                                type="number"
                                step="0.0001"
                            />
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-card class="mb-4">
                <v-card-title class="d-flex align-center">
                    <v-icon start icon="mdi-timeline-clock" />
                    Timeline
                    <v-spacer />
                    <v-btn
                        size="small"
                        variant="tonal"
                        color="primary"
                        @click="addTimelineEntry"
                    >
                        <v-icon start icon="mdi-plus" />
                        Add Entry
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-expansion-panels variant="accordion">
                        <v-expansion-panel
                            v-for="(entry, index) in about.timeline"
                            :key="index"
                        >
                            <v-expansion-panel-title>
                                <div class="d-flex align-center gap-2">
                                    <v-chip size="small" variant="tonal">{{
                                        entry.year
                                    }}</v-chip>
                                    <span>{{ entry.title || "Untitled" }}</span>
                                    <v-chip size="x-small" variant="outlined">{{
                                        entry.type
                                    }}</v-chip>
                                </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-row density="comfortable">
                                    <v-col cols="12" sm="4">
                                        <v-text-field
                                            v-model="entry.year"
                                            label="Year"
                                            variant="outlined"
                                            density="compact"
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="8">
                                        <v-text-field
                                            v-model="entry.title"
                                            label="Title"
                                            variant="outlined"
                                            density="compact"
                                        />
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea
                                            v-model="entry.description"
                                            label="Description"
                                            variant="outlined"
                                            density="compact"
                                            rows="2"
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <v-text-field
                                            v-model="entry.company"
                                            label="Company"
                                            variant="outlined"
                                            density="compact"
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <v-text-field
                                            v-model="entry.icon"
                                            label="Icon (mdi-*)"
                                            variant="outlined"
                                            density="compact"
                                            prepend-inner-icon="mdi-emoticon"
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <v-select
                                            v-model="entry.type"
                                            :items="timelineTypes"
                                            label="Type"
                                            variant="outlined"
                                            density="compact"
                                        />
                                    </v-col>
                                </v-row>
                                <div class="d-flex justify-end">
                                    <v-btn
                                        size="small"
                                        color="error"
                                        variant="text"
                                        @click="removeTimelineEntry(index)"
                                    >
                                        <v-icon start icon="mdi-delete" />
                                        Remove
                                    </v-btn>
                                </div>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <div
                        v-if="!about.timeline.length"
                        class="text-center pa-4 text-medium-emphasis"
                    >
                        No timeline entries. Click "Add Entry" to create one.
                    </div>
                </v-card-text>
            </v-card>

            <v-card class="mb-4">
                <v-card-title class="d-flex align-center">
                    <v-icon start icon="mdi-star" />
                    Skill Categories
                    <v-spacer />
                    <v-btn
                        size="small"
                        variant="tonal"
                        color="primary"
                        @click="addSkillCategory"
                    >
                        <v-icon start icon="mdi-plus" />
                        Add Category
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-expansion-panels variant="accordion">
                        <v-expansion-panel
                            v-for="(category, index) in about.skillCategories"
                            :key="index"
                        >
                            <v-expansion-panel-title>
                                <div class="d-flex align-center gap-2">
                                    <v-icon
                                        v-if="category.icon"
                                        :icon="category.icon"
                                        size="small"
                                    />
                                    <span>{{
                                        category.name || "Unnamed Category"
                                    }}</span>
                                    <v-chip size="x-small" variant="tonal">
                                        {{ category.skills.length }} skills
                                    </v-chip>
                                </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-row density="comfortable">
                                    <v-col cols="12" sm="6">
                                        <v-text-field
                                            v-model="category.name"
                                            label="Category Name"
                                            variant="outlined"
                                            density="compact"
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field
                                            v-model="category.icon"
                                            label="Icon (mdi-*)"
                                            variant="outlined"
                                            density="compact"
                                            prepend-inner-icon="mdi-emoticon"
                                        />
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field
                                            :model-value="
                                                category.skills.join(', ')
                                            "
                                            label="Skills (comma-separated)"
                                            variant="outlined"
                                            density="compact"
                                            hint="Enter skills separated by commas"
                                            persistent-hint
                                            @update:model-value="
                                                category.skills = ($event ?? '')
                                                    .split(',')
                                                    .map((s: string) =>
                                                        s.trim(),
                                                    )
                                                    .filter(Boolean)
                                            "
                                        />
                                    </v-col>
                                </v-row>
                                <div class="d-flex justify-end">
                                    <v-btn
                                        size="small"
                                        color="error"
                                        variant="text"
                                        @click="removeSkillCategory(index)"
                                    >
                                        <v-icon start icon="mdi-delete" />
                                        Remove
                                    </v-btn>
                                </div>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <div
                        v-if="!about.skillCategories.length"
                        class="text-center pa-4 text-medium-emphasis"
                    >
                        No skill categories. Click "Add Category" to create one.
                    </div>
                </v-card-text>
            </v-card>

            <v-card class="mb-4">
                <v-card-title class="d-flex align-center">
                    <v-icon start icon="mdi-school" />
                    Education
                    <v-spacer />
                    <v-btn
                        size="small"
                        variant="tonal"
                        color="primary"
                        @click="addEducation"
                    >
                        <v-icon start icon="mdi-plus" />
                        Add Education
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-expansion-panels variant="accordion">
                        <v-expansion-panel
                            v-for="(edu, index) in about.education"
                            :key="index"
                        >
                            <v-expansion-panel-title>
                                <div class="d-flex align-center gap-2">
                                    <span>{{
                                        edu.institution || "Unnamed Institution"
                                    }}</span>
                                    <v-chip
                                        size="x-small"
                                        :color="
                                            edu.status === 'completed'
                                                ? 'success'
                                                : 'info'
                                        "
                                        variant="tonal"
                                    >
                                        {{ edu.status }}
                                    </v-chip>
                                </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-row density="comfortable">
                                    <v-col cols="12" sm="6">
                                        <v-text-field
                                            v-model="edu.institution"
                                            label="Institution"
                                            variant="outlined"
                                            density="compact"
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field
                                            v-model="edu.degree"
                                            label="Degree"
                                            variant="outlined"
                                            density="compact"
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field
                                            v-model="edu.period"
                                            label="Period"
                                            variant="outlined"
                                            density="compact"
                                            placeholder="e.g. 2020 - 2024"
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-select
                                            v-model="edu.status"
                                            :items="educationStatuses"
                                            label="Status"
                                            variant="outlined"
                                            density="compact"
                                        />
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea
                                            v-model="edu.description"
                                            label="Description (tell more about this education)"
                                            variant="outlined"
                                            density="compact"
                                            rows="3"
                                            hint="Add details about courses, achievements, or anything noteworthy"
                                            persistent-hint
                                        />
                                    </v-col>
                                </v-row>
                                <div class="d-flex justify-end">
                                    <v-btn
                                        size="small"
                                        color="error"
                                        variant="text"
                                        @click="removeEducation(index)"
                                    >
                                        <v-icon start icon="mdi-delete" />
                                        Remove
                                    </v-btn>
                                </div>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <div
                        v-if="!about.education.length"
                        class="text-center pa-4 text-medium-emphasis"
                    >
                        No education entries. Click "Add Education" to create
                        one.
                    </div>
                </v-card-text>
            </v-card>

            <div class="d-flex justify-end">
                <v-btn
                    color="primary"
                    variant="elevated"
                    size="large"
                    :loading="saving"
                    @click="saveAbout"
                >
                    <v-icon start icon="mdi-content-save" />
                    Save About Content
                </v-btn>
            </div>
        </template>

        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
            {{ snackbarText }}
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import type {
    AboutContent,
    TimelineEntry,
    SkillCategory,
    Education,
} from "~~/shared/types";

const timelineTypes = ["work", "education", "achievement"] as const;
const educationStatuses = [
    { title: "Completed", value: "completed" as const },
    { title: "In Progress", value: "in-progress" as const },
];

const about = ref<AboutContent | null>(null);
const loading = ref(true);
const fetchError = ref(false);
const saving = ref(false);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

async function loadAbout() {
    loading.value = true;
    fetchError.value = false;
    try {
        about.value = await $fetch<AboutContent>("/api/admin/about");
    } catch {
        fetchError.value = true;
    } finally {
        loading.value = false;
    }
}

function addTimelineEntry() {
    if (!about.value) return;
    const entry: TimelineEntry = {
        year: new Date().getFullYear().toString(),
        title: "",
        description: "",
        company: "",
        icon: "mdi-briefcase",
        type: "work",
    };
    about.value.timeline.push(entry);
}

function removeTimelineEntry(index: number) {
    if (!about.value) return;
    about.value.timeline.splice(index, 1);
}

function addSkillCategory() {
    if (!about.value) return;
    const category: SkillCategory = {
        name: "",
        icon: "mdi-code-tags",
        skills: [],
    };
    about.value.skillCategories.push(category);
}

function removeSkillCategory(index: number) {
    if (!about.value) return;
    about.value.skillCategories.splice(index, 1);
}

function addEducation() {
    if (!about.value) return;
    const edu: Education = {
        institution: "",
        degree: "",
        period: "",
        status: "in-progress",
        description: "",
    };
    about.value.education.push(edu);
}

function removeEducation(index: number) {
    if (!about.value) return;
    about.value.education.splice(index, 1);
}

async function saveAbout() {
    if (!about.value) return;
    saving.value = true;
    try {
        await $fetch("/api/admin/about", {
            method: "PUT",
            body: about.value,
        });
        snackbarText.value = "About content saved successfully";
        snackbarColor.value = "success";
        snackbar.value = true;
    } catch {
        snackbarText.value = "Failed to save about content";
        snackbarColor.value = "error";
        snackbar.value = true;
    } finally {
        saving.value = false;
    }
}

onMounted(loadAbout);
</script>
