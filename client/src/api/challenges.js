import api from './client';

export const generateChallenge = (topic, difficulty) =>
  api.post('/challenges/generate', { topic, difficulty });

export const getChallenges = (filters = {}) =>
  api.get('/challenges', { params: filters });

export const getChallenge = (id) =>
  api.get(`/challenges/${id}`);