import { it,expect,afterEach } from 'vitest';
import { answerFounder,describeRecommendations } from '../../lib/superbrain/assistant';
afterEach(()=>{delete process.env.SUPERBRAIN_AI_ENABLED;});
it('works without credentials and discloses missing evidence',async()=>{
 process.env.SUPERBRAIN_AI_ENABLED='false';
 expect(await answerFounder('What happened?',[])).toContain('could not find');
 expect(await answerFounder('What is the rule?',[{id:'rule',title:'Brand',content:'Use approved cast'}])).toContain('Use approved cast');
 expect(await describeRecommendations('Find classes',[])).toContain('No recently verified');
});
