import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_KEY = "add your api key";

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async ({ location, taskId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }

      const data = await response.json();
      return { taskId, data };
    } catch (error) {
      return rejectWithValue({ taskId, error: error.message });
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    weatherData: {}, // Store weather data by taskId
    loading: {},     // Store loading states by taskId
    errors: {},      // Store errors by taskId
    forecasts: {},   // Store 5-day forecast by taskId
  },
  reducers: {
    clearWeatherData: (state, action) => {
      const taskId = action.payload;
      delete state.weatherData[taskId];
      delete state.loading[taskId];
      delete state.errors[taskId];
      delete state.forecasts[taskId];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state, action) => {
        const taskId = action.meta.arg.taskId;
        state.loading[taskId] = true;
        state.errors[taskId] = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        const { taskId, data } = action.payload;
        state.weatherData[taskId] = data;
        state.loading[taskId] = false;
        state.errors[taskId] = null;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        const { taskId } = action.meta.arg;
        state.loading[taskId] = false;
        state.errors[taskId] = action.payload?.error || 'Failed to fetch weather';
        state.weatherData[taskId] = null;
      });
  },
});

export const { clearWeatherData } = weatherSlice.actions;
export default weatherSlice.reducer;
