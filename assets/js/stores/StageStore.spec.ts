import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStageStore } from './StageStore';
import { fetchStage, fetchStages, updateStage } from '../services/stage.service';
import { defaultStage, defaultStage1, defaultStages } from '../samples/stage.sample';

vi.mock('../services/stage.service');

describe('browseStages', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('calls fetchStages()', async () => {
        const stageStore = useStageStore(createPinia());
        vi.mocked(fetchStages).mockResolvedValue(defaultStages);
        
        await stageStore.browseStages();

        expect(fetchStages).toHaveBeenCalled();
        expect(stageStore.getStages.value).toStrictEqual(defaultStages);
    });
});

describe('browseCurrentStage', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.mocked(fetchStage).mockReset();
    });

    it('calls fetchStage(id) with empty currentStage', async () => {
        const stageStore = useStageStore(createPinia());
        vi.mocked(fetchStage).mockResolvedValue(defaultStage);
        
        await stageStore.browseCurrentStage(defaultStage.id);

        expect(fetchStage).toHaveBeenCalled();
        expect(stageStore.getCurrentStage.value).toStrictEqual(defaultStage);
    });

    it('calls fetchStage(id) with new currentStage', async () => {
        const stageStore = useStageStore(createPinia());
        vi.mocked(fetchStage).mockResolvedValue(defaultStage);
        await stageStore.browseCurrentStage(defaultStage.id);
        vi.mocked(fetchStage).mockResolvedValue(defaultStage1);

        await stageStore.browseCurrentStage(defaultStage1.id);

        expect(fetchStage).toHaveBeenCalled();
        expect(stageStore.getCurrentStage.value).toStrictEqual(defaultStage1);
    });

    it('does nothing, currentStage already being currentStage', async () => {
        const stageStore = useStageStore(createPinia());
        vi.mocked(fetchStage).mockResolvedValue(defaultStage);
        await stageStore.browseCurrentStage(defaultStage.id);
        expect(fetchStage).toHaveBeenCalledTimes(1);

        await stageStore.browseCurrentStage(defaultStage.id);

        expect(fetchStage).toHaveBeenCalledTimes(1);
        expect(stageStore.getCurrentStage.value).toStrictEqual(defaultStage);
    });
});

describe('editStage', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('calls updateStage(stage) and calls browseStages()'), async () => {
        const stageStore = useStageStore(createPinia());
        await stageStore.editStage(defaultStage);
        expect(updateStage).toHaveBeenCalled();
        expect(fetchStages).toHaveBeenCalled();
    }
});

describe('updateCurrentStage', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('calls updateStage(stage) and calls browseStages()', async () => {
        const stageStore = useStageStore(createPinia());
        vi.mocked(fetchStage).mockResolvedValue(defaultStage);
        await stageStore.browseCurrentStage(defaultStage.id);
        vi.mocked(updateStage).mockResolvedValue(defaultStage1);
        
        await stageStore.updateCurrentStage(defaultStage.id);

        expect(updateStage).toHaveBeenCalled();
        expect(stageStore.getCurrentStage.value).toStrictEqual(defaultStage1);
        expect(fetchStages).toHaveBeenCalled();
    });
});