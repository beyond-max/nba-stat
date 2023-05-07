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
                <b-form-radio v-on:change="filterByPosition" inline value="all"> All</b-form-radio>
                <b-form-radio v-on:change="filterByPosition" v-for="p in positions" :key="p" inline :value="p"> {{p}}</b-form-radio>
              </b-form-radio-group>
            </b-form-group>
          </b-col>
          <b-col lg="3" class="my-1">
            <b-form-group label="Stat Types">
              <b-form-radio-group class="mt-lg-2" v-model="statType">
                <b-form-radio v-on:change="filterByStatType" inline value="all"> All</b-form-radio>
                <b-form-radio v-on:change="filterByStatType" v-for="s in statTypes" :key="s" inline :value="s"> {{s}}</b-form-radio>
              </b-form-radio-group>
            </b-form-group>
          </b-col>
          <b-col lg="3" class="my-1">
            <b-form-group label="Market Status">
              <b-form-radio-group class="mt-lg-2" v-model="statType">
                <b-form-radio v-on:change="filterByStatType" inline value="all"> All</b-form-radio>
                <b-form-radio v-on:change="filterByStatType" inline value="true"> Open</b-form-radio>
                <b-form-radio v-on:change="filterByStatType" inline value="false"> Suspended</b-form-radio>
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
                  v-model="filter"
                  type="search"
                  placeholder="Search By player name or team name"
                ></b-form-input>
                <b-input-group-append>
                  <b-button @click="demo">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>

        </b-row>
        <!-- Main table element -->
        <b-table
          :items="data"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :filter-included-fields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          stacked="md"
          show-empty
          small
          @filtered="onFiltered"
        >
          <template #cell(actions)="row">
            <b-button size="sm" @click="demo">
              {{ row.item.marketStatus ? 'Disable' : 'Enble' }} Market
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
          data : [],
          positions: [],
          position: "all",
          statTypes: [],
          statType: "all",

          items: [
            { isActive: true, age: 40, name: { first: 'Dickerson', last: 'Macdonald' } },
            { isActive: false, age: 21, name: { first: 'Larsen', last: 'Shaw' } },
            {
              isActive: false,
              age: 9,
              name: { first: 'Mini', last: 'Navarro' },
              _rowVariant: 'success'
            },
            { isActive: false, age: 89, name: { first: 'Geneva', last: 'Wilson' } },
            { isActive: true, age: 38, name: { first: 'Jami', last: 'Carney' } },
            { isActive: false, age: 27, name: { first: 'Essie', last: 'Dunlap' } },
            { isActive: true, age: 40, name: { first: 'Thor', last: 'Macdonald' } },
            {
              isActive: true,
              age: 87,
              name: { first: 'Larsen', last: 'Shaw' },
              _cellVariants: { age: 'danger', isActive: 'warning' }
            },
            { isActive: false, age: 26, name: { first: 'Mitzi', last: 'Navarro' } },
            { isActive: false, age: 22, name: { first: 'Genevieve', last: 'Wilson' } },
            { isActive: true, age: 38, name: { first: 'John', last: 'Carney' } },
            { isActive: false, age: 29, name: { first: 'Dick', last: 'Dunlap' } }
          ],
          fields: [
            { key: 'playerName', label: 'Player Name', sortable: true, class: 'text-center', sortDirection: 'desc' },
            { key: 'teamAbbr', label: 'Team Name', sortable: true, class: 'text-center'},
            { key: 'teamNickname', label: 'Team NickName', class: 'text-center'},
            { key: 'statType', label: 'Market Type', sortable: true, class: 'text-center' },
            { key: 'position', label: 'Position', class: 'text-center' },
            
            { 
              key: 'marketStatus',
              label: 'Market Status',
              formatter: (value, key, item) => {
                return value ? 'Open' : 'Suspended'
              },
              sortable: true,
              // sortByFormatted: true,
              // filterByFormatted: true,
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
        filterByPosition() {
          this.data = this.data.filter(e => e.position == this.position)
        },
        filterByStatType() {
          this.data = this.data.filter(e => e.statType == this.statType)
        },
        demo() {

        },
        async getSportsList() {
            let propsData = await require('@/data/props.json')
            let alternatesData = await require('@/data/alternates.json')
            this.loading = false
            this.data = propsData
            let grouped = Object.values(alternatesData.reduce((a,c)=> {
              let i = a[JSON.stringify([c.playerId, c.statTypeId])] ??= {playerId: c.playerId, statTypeId: c.statTypeId, low: c.line, high: c.line, marketStatus: true};
              if ( c. overOdds < 0.4 && c.pushOdds < 0.4 && c.underOdds < 0.4 )
                i.marketStatus = false
              if (i.low > c.line)
                i.low = c.line
              if (i.high < c.line)
                i.high = c.line
              return a;
            } , {}));
            // adding data
            let dataRefined = [];
            // dataRefined.push
            propsData.map ( p => {
                let obj = {}
                obj = p
                if (p.marketSuspended == 0)
                  obj.marketStatus = true
                else (p.marketSuspended == 1)
                  obj.marketStatus = false
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
                  obj.marketStatus = false
                dataRefined.push(obj);
              }
            )
            this.positions = Object.keys(_.groupBy(propsData, 'position'))
            this.statTypes = Object.keys(_.groupBy(propsData, 'statType'))
            console.log(dataRefined);
          },

          info(item, index, button) {
        this.infoModal.title = `Row index: ${index}`
        this.infoModal.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length
        this.currentPage = 1
      }
      },
  }
</script>

