import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getValidAuthTokens } from "@/lib/cookies";

interface DocumentTemplate {
  title: string;
  content: any; // TipTap JSON
  variables: string[];
  sessionId: string;
  type: "before" | "during" | "after";
}

interface DocumentState {
  templates: DocumentTemplate[];
  loading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  templates: [],
  loading: false,
  error: null,
};

export const saveDocument = createAsyncThunk(
  "document/saveDocument",
  async (template: DocumentTemplate, { rejectWithValue }) => {
    try {
      const { token } = getValidAuthTokens();
      if (!token) {
        return rejectWithValue("No auth token");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/documents/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-connexion-tantor": `Bearer ${token}`,
        },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save document");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Save failed");
    }
  }
);

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDocument.fulfilled, (state, action: PayloadAction<DocumentTemplate>) => {
        state.loading = false;
        if (action.payload) {
          state.templates.push(action.payload);
        }
      })
      .addCase(saveDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = documentSlice.actions;
export default documentSlice.reducer;
