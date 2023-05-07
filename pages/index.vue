<template>
  <div class="mt-5">
    <div v-if="loading">Loading</div>
    <div v-else style="display: flex; justify-content: space-between;">
      <b-container>
        <!-- User Interface controls -->
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
        <b-row>
          <b-col lg="12" class="mx-5 mt-1 mb-3">
            <b-form-group
              label-for="filter-input"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  id="filter-input"
                  v-model="name"
                  type="search"
                  placeholder="Search By player name or team name"
                ></b-form-input>
                <b-input-group-append>
                  <b-button @click="filterByOptions">search</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

        <b-table
          :items="data"
          :fields="fields"
          :per-page="perPage"
          stacked="md"
          show-empty
          small
          @filtered="onFiltered"
        >
          <template #cell(actions)="row">
            <b-button size="sm" @click="demo(row.item, row.index, $event.target)">
              {{ row.item.marketStatus === 'open' ? 'Disable' : 'Enble' }} Market
            </b-button>
          </template>
        </b-table>
      </b-container>
    </div>

  </div>
</template>
<script>
  import _ from 'lodash';
  export default {
      name: "Home",
      data() {
        return {
          // radioo: '',
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
          loading: true,
        }
      },
      created() {
          this.getSportsList()
          // console.log(this.$store.state)
      },
      computed: {
        sortOptions() {
          // Create an options list from our fields
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

        demo(row, b, c) {
    // row.marketStatus = 'closed'

          //  let index = this.data.findIndex((x) => x.playerId === row.playerId.id && x.statTypeId === row.statTypeId);
          //  console.log(this.data)
    // this.data[index].marketStatus = 'closed'
          this.$store.dispatch('updateData', row)

          // console.log(a)
          // console.log(b)
          // console.log(c)
          // a.marketStatus = 'closed'

        },
        async getSportsList() {
            this.$store.dispatch('getData')
            this.data = this.$store.state.data
            this.positions = Object.keys(_.groupBy(this.data, 'position'))
            this.statTypes = Object.keys(_.groupBy(this.data, 'statType'))
            this.loading = false
          },
        onFiltered(filteredItems) {
          this.totalRows = filteredItems.length
          // this.currentPage = 1
        }
      },
  }
</script>

