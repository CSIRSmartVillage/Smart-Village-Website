import assert from 'node:assert/strict';
import { test } from 'node:test';
import Member from './MonitoringCommitteeMember.model.js';
import Settings from './MonitoringCommitteeSettings.model.js';
import { createMonitoringCommitteeMemberSchema, updateMonitoringCommitteeSettingsSchema } from './monitoringCommittee.validation.js';
import { getAdminMonitoringCommittee, createMonitoringCommitteeMember, updateMonitoringCommitteeMember, reorderMonitoringCommitteeMembers } from './monitoringCommittee.service.js';
const query = value => ({ populate() { return this; }, sort() { return this; }, select() { return this; }, lean: async () => value });

test('only fixed placements are accepted; personal details stay optional', async () => {
  for (const role of ['CHAIRMAN', 'MEMBER', 'OTHER']) {
    assert.equal(createMonitoringCommitteeMemberSchema.safeParse({ body: { role } }).success, true);
    await new Member({ role }).validate();
  }
  for (const role of ['CONVENER', 'HEAD', 'custom-row']) {
    assert.equal(createMonitoringCommitteeMemberSchema.safeParse({ body: { role } }).success, false);
  }
  assert.equal(updateMonitoringCommitteeSettingsSchema.safeParse({ body: { rows: [] } }).success, false);
  assert.equal(updateMonitoringCommitteeSettingsSchema.safeParse({ body: { membersHeading: 'Rename row' } }).success, false);
});

test('legacy and dynamic members join Other Members and keep individual headings', async t => {
  t.mock.method(Settings, 'findOne', () => query({ conveyersHeading: 'Conveyer', rows: [{ id: 'custom', title: 'Member Secretary' }] }));
  t.mock.method(Member, 'find', () => query([
    { _id: '1', role: 'MEMBER', name: 'First' },
    { _id: '2', role: 'CONVENER' },
    { _id: '3', role: 'HEAD', roleLabel: 'Project Head' },
    { _id: '4', role: 'custom' },
  ]));
  const members = await getAdminMonitoringCommittee();
  assert.deepEqual(members.map(m => m.role), ['MEMBER', 'OTHER', 'OTHER', 'OTHER']);
  assert.deepEqual(members.slice(1).map(m => m.roleLabel), ['Conveyer', 'Project Head', 'Member Secretary']);
});

test('single Chairman rule remains enforced', async t => {
  t.mock.method(Member, 'exists', async () => ({ _id: 'chair' }));
  await assert.rejects(createMonitoringCommitteeMember({ role: 'CHAIRMAN' }, null), /Chairman already exists/);
  await assert.rejects(createMonitoringCommitteeMember({ role: 'custom' }, null), /Select Chairman/);
});

test('editing a legacy member saves its individual heading in the fixed second row', async t => {
  const member = { _id: 'a'.repeat(24), role: 'HEAD', name: 'Existing person', save: async () => {} };
  const populated = { populate() { return this; }, then(resolve) { return Promise.resolve(member).then(resolve); } };
  t.mock.method(Member, 'findById', () => populated);
  await updateMonitoringCommitteeMember(member._id, { role: 'OTHER', roleLabel: 'Member Secretary', displayOrder: 4 }, null);
  assert.equal(member.role, 'OTHER');
  assert.equal(member.roleLabel, 'Member Secretary');
  assert.equal(member.name, 'Existing person');
});

test('second row can reorder mixed legacy roles together', async t => {
  let writes;
  t.mock.method(Member, 'find', filter => {
    if (filter) assert.deepEqual(filter.role, { $nin: ['CHAIRMAN', 'MEMBER'] });
    return query([{ _id: 'a', role: 'CONVENER' }, { _id: 'b', role: 'OTHER' }]);
  });
  t.mock.method(Member, 'bulkWrite', async operations => { writes = operations; });
  t.mock.method(Settings, 'findOne', () => query(null));
  await reorderMonitoringCommitteeMembers({ role: 'OTHER', orderedIds: ['b', 'a'], adminId: null });
  assert.equal(writes[0].updateOne.filter._id, 'b');
  assert.deepEqual(writes[0].updateOne.filter.role, { $nin: ['CHAIRMAN', 'MEMBER'] });
});
