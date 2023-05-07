    var propsData = require('@/data/props.json')
    const alternatesData = require('@/data/alternates.json')

// const state = getDefaultState()
const state = () => ({
  // propsData: propsData,
  // alternatesData: alternatesData,
  data: [],
  isSidebarToggled: true,
  isLeftPanelToggled: true,
  isRightPanelToggled: false,
  isModal: false,
  modalType: '',
  isMobileView: true,
});

const mutations = {
  setLeftPanelToggle(state) {
    return (state.isLeftPanelToggled = !state.isLeftPanelToggled);
  },
  setRightPanelToggle(state){
    return (state.isRightPanelToggled = !state.isRightPanelToggled);
  },
  // sidebar toggle handler
  setSidebarToggle(state) {
    return (state.isSidebarToggled = !state.isSidebarToggled);
  },
  // modal handler
  showModal(state) {
    state.isModal = true;

  },
  closeModal(state) {
    state.isModal = false;
    state.modalType = ''
  },
  logout(state) {
    Object.assign(state, getDefaultState())
  },
  setDevice(state, value){
    state.device = value
    if (value.isMobile || value.isTablet){
      state.isLeftPanelToggled = false;
      state.isRightPanelToggled = false;
    }
  },
  SET_MODAL_TYPE(state, value){
    state.isModal = true
    state.modalType = value
  },
  async GET_DATA (state) {
    // state.data = propsData
    console.log('ahsdfe')
    // state.propsData = ['p','l']
    // state.alternatesData = alternatesData
    let grouped = Object.values(alternatesData.reduce((a,c)=> {
      let i = a[JSON.stringify([c.playerId, c.statTypeId])] ??= {playerId: c.playerId, statTypeId: c.statTypeId, low: c.line, high: c.line, marketStatus: 'open'};
      if ( c. overOdds < 0.4 && c.pushOdds < 0.4 && c.underOdds < 0.4 )
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
  getData({ commit }) {
    return new Promise(() => {
      commit('GET_DATA')
    })
  },
  updateData({commit}, row){
    commit('UPDATE_DATA', row)


  },

  
  setModalType({commit}, role){
    commit('SET_MODAL_TYPE', role)
  },
}
const getDefaultState = () => {
  return {
    isSidebarToggled: true,
    isModal: false,
  }
};

export default {
  state,
  mutations,
  actions
  // getters
}