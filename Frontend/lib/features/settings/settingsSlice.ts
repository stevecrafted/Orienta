import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { SettingsState } from "@/lib/types"

const initialState: SettingsState = {
    branding: true,
    theme: "light",
    fontSize: 1,
    fontFamily: "Inter",
    template: "double-column",
    showTemplatesModal: false,
    showAddSectionModal: false,
    addSectionColumn: "left",
}

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        toggleBranding: (state) => {
            state.branding = !state.branding
        },

        setTheme: (state, action: PayloadAction<"light" | "dark">) => {
            state.theme = action.payload
        },

        setFontSize: (state, action: PayloadAction<number>) => {
            state.fontSize = action.payload
        },

        setFontFamily: (state, action: PayloadAction<string>) => {
            state.fontFamily = action.payload
        },

        setTemplate: (state, action: PayloadAction<{ template: string }>) => {
            state.template = action.payload.template
        },

        setTemplatesModal: (state, action: PayloadAction<boolean>) => {
            state.showTemplatesModal = action.payload
        },

        setAddSectionModal: (state, action: PayloadAction<{ isOpen: boolean; column?: "left" | "right" }>) => {
            state.showAddSectionModal = action.payload.isOpen
            if (action.payload.column) {
                state.addSectionColumn = action.payload.column
            }
        },

        // Action pour charger un état complet des paramètres (depuis localStorage ou API)
        loadSettingsState: (state, action: PayloadAction<Partial<SettingsState>>) => {
            if (action.payload.branding !== undefined) {
                state.branding = action.payload.branding
            }
            if (action.payload.theme) {
                state.theme = action.payload.theme
            }
            if (action.payload.fontSize !== undefined) {
                state.fontSize = action.payload.fontSize
            }
            if (action.payload.fontFamily) {
                state.fontFamily = action.payload.fontFamily
            }
            if (action.payload.template) {
                state.template = action.payload.template
            }
        },

        // Action pour réinitialiser complètement les paramètres
        resetSettingsState: (state) => {
            return initialState
        },
    },
})

export const {
    toggleBranding,
    setTheme,
    setFontSize,
    setFontFamily,
    setTemplate,
    setTemplatesModal,
    setAddSectionModal,
    loadSettingsState,
    resetSettingsState,
} = settingsSlice.actions

export default settingsSlice.reducer
