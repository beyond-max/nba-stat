const propsData = require('@/data/props.json')
const alternatesData = require('@/data/alternates.json')

const state = () => ({
  data: [],
});

const mutations = {
  SET_MODAL_TYPE(state, value){
    state.isModal = true
    state.modalType = value
  },
  async SET_DATA (state) {
    let grouped = Object.values(alternatesData.reduce((a,c)=> {
      let i = a[JSON.stringify([c.playerId, c.statTypeId])] ??= 
              {playerId: c.playerId, statTypeId: c.statTypeId, low: c.line, high: c.line, marketStatus: 'open'};
      if ( c.overOdds < 0.4 && c.pushOdds < 0.4 && c.underOdds < 0.4 )
        i.marketStatus = 'closed'
      if (i.low > c.line)
        i.low = c.line
      if (i.high < c.line)
        i.high = c.line
      return a;
    } , {}));
    state.data = []
    propsData.map ( p => {
      let obj = {}
      obj = p
      if (p.marketSuspended == 0)
        obj.marketStatus = 'open'
      else (p.marketSuspended == 1)
        obj.marketStatus = 'closed'
      let result = grouped.filter(function (v, i) {
        return (v.playerId == p.playerId && v.statTypeId == p.statTypeId)
      }, [])
      if (result.length > 0){
        obj.ref = result[0]
        obj.low = result[0].low
        obj.high = result[0].high
        obj.marketStatus = result[0].marketStatus
      }
      else
        obj.marketStatus = 'closed'
        state.data.push(obj);
      }
    )
  },
  UPDATE_DATA (state, row) {
    let index = state.data.findIndex((x) => x.playerId === row.playerId && x.statTypeId === row.statTypeId);
    if (state.data[index].marketStatus == 'open')
      state.data[index].marketStatus = 'closed'
    else
      state.data[index].marketStatus = 'open'
  }
};
const actions = {
  setData({ commit }) {
    return new Promise(() => {
      commit('SET_DATA')
    })
  },
  updateData({commit}, row){
    commit('UPDATE_DATA', row)
  },
}
const getDefaultState = () => {
  return {
  }
};

export default {
  state,
  mutations,
  actions
}