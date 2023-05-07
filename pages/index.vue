<template>
<b-container>
    <h1 class="my-5" style="text-align: center">NBA Player Statistics</h1>
    <b-row class="mx-5 px-5">
      <b-col lg="3" class="my-1">
          <b-form-group label="Positions">
          <b-form-radio-group class="mt-lg-2" v-model="position">
            <b-form-radio v-on:change="filterByOptions" inline value=""> All</b-form-radio>
            <b-form-radio v-on:change="filterByOptions" v-for="p in positions" :key="p" inline :value="p"> {{p}}</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-col>
      <b-col lg="3" class="my-1">
        <b-form-group label="Stat Types">
          <b-form-radio-group class="mt-lg-2" v-model="statType">
            <b-form-radio v-on:change="filterByOptions" inline value=""> All</b-form-radio>
            <b-form-radio v-on:change="filterByOptions" v-for="s in statTypes" :key="s" inline :value="s"> {{s}}</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-col>
      <b-col lg="3" class="my-1">
        <b-form-group label="Market Status">
          <b-form-radio-group class="mt-lg-2" v-model="marketStatus">
            <b-form-radio v-on:change="filterByOptions" inline value=""> All</b-form-radio>
            <b-form-radio v-on:change="filterByOptions" inline value="open"> Open</b-form-radio>
            <b-form-radio v-on:change="filterByOptions" inline value="closed"> Suspended</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-col>
      <b-col lg="3" class="my-1">
        <b-form-group
          label="Per page"
          label-for="per-page-select"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="sm"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <div class="mt-2 mb-4" style="display: flex; justify-content: space-between">
      <b-form-input
        id="filter-input"
        v-model="name"
        type="search"
        placeholder="Search By player name or team name"
        style="width: 50%"
        @input="filterByOptions"
      ></b-form-input>
      <b-button variant="danger" @click="refreshData">Refresh</b-button>
    </div>

    <b-table
      :items="data"
      :fields="fields"
      :per-page="perPage"
      show-empty
      small
      outlined
      @filtered="onFiltered"
    >
      <template #cell(actions)="row">
        <b-button :variant="row.item.marketStatus === 'open' ? '': 'primary'" size="sm" @click="updateMarketStatus(row.item)" style="width: 75%">
          {{ row.item.marketStatus === 'open' ? 'Disable' : 'Enble' }} Market
        </b-button>
      </template>
    </b-table>
  </b-container>
</template>
<script>
  import _ from 'lodash';
  export default {
      name: "Home",
      data() {
        return {
          name: '',
          data : [],
          positions: [],
          position: "",
          statTypes: [],
          statType: "",
          marketStatus: "",
          fields: [
            { key: 'playerName', label: 'Player Name', sortable: true, class: 'text-center', sortDirection: 'desc' },
            { key: 'teamAbbr', label: 'Team Name', sortable: true, class: 'text-center'},
            { key: 'teamNickname', label: 'Team NickName', class: 'text-center'},
            { key: 'statType', label: 'Market Type', class: 'text-center' },
            { key: 'position', label: 'Position', class: 'text-center' },
            { 
              key: 'marketStatus',
              label: 'Market Status',
              formatter: (value, key, item) => {
                return value == 'open' ? 'Open' : 'Suspended'
              },
              class: 'text-center'
            },
            { key: 'low', label: 'Low', class: 'text-center'},
            { key: 'high', label: 'High', class: 'text-center'},
            { key: 'actions', label: 'Actions', class: 'text-center' }
          ],
          perPage: 20,
          pageOptions: [20, 50, 200, { value: 500, text: "Show a lot" }],
        }
      },
      created() {
          this.getSportsList()
      },
      computed: {
        sortOptions() {
          return this.fields
            .filter(f => f.sortable)
            .map(f => {
              return { text: f.label, value: f.key }
            })
        }
      },
      methods: {
        filterByOptions() {
              this.data = this.$store.state.data
                .filter(e => e.position.includes(this.position))
                .filter(e => e.statType.includes(this.statType))
                .filter(e => e.marketStatus.includes(this.marketStatus))
                .filter(e => e.playerName.toLowerCase().includes(this.name.toLowerCase()) 
                            || e.teamAbbr.toLowerCase().includes(this.name.toLowerCase()) 
                            || e.teamNickname.toLowerCase().includes(this.name.toLowerCase()))
        },
        updateMarketStatus(row) {
          this.$store.dispatch('updateData', row)
          this.filterByOptions()
        },
        refreshData() {
          this.$store.dispatch('setData')
          this.name = ''
          this.position = ''
          this.statType = ''
          this.marketStatus = ''
          this.data = this.$store.state.data
          this.perPage = 20
        },
        async getSportsList() {
            this.$store.dispatch('setData')
            this.data = this.$store.state.data
            this.positions = Object.keys(_.groupBy(this.data, 'position'))
            this.statTypes = Object.keys(_.groupBy(this.data, 'statType'))
        },
        onFiltered(filteredItems) {
          this.totalRows = filteredItems.length
        }
      },
  }
</script>

