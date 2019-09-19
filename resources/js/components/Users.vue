<template>
    <div class="container">
        <div class="row mt-5"  v-if="$gate.isAdmin()">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Users Table</h3>

                <div class="card-tools">
                    <button class="btn btn-success" @click="newModal">Add New
                        <i class="fas fa-user-plus fa-fw"></i>
                    </button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Created at</th>
                        <th>Modify</th>
                    </tr>
                    <tr v-for="user in users.data" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.type | upper }}</td>
                        <td>{{ user.created_at | myDate }}</td>
                        <td>
                            <a href="#" @click="editModel(user)">
                                <i class="fa fa-edit blue"></i>
                            </a>
                            /
                            <a href="#" @click="deleteUser(user.id)">
                                <i class="fa fa-trash red"></i>
                            </a>

                        </td>
                  </tr>
                </tbody></table>
              </div>
              <!-- /.card-body -->
              <div class="card-footer">
                  <pagination :data="users" @pagination-change-page="getResults"></pagination>
              </div>
            </div>
            <!-- /.card -->
          </div>
        </div>

        <div v-if="!$gate.isAdmin()">
            <notFound></notFound>
        </div>
    <!-- Modal -->
            <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" v-show="!editMode" id="addNewLabel">Add New</h5>

                            <h5 class="modal-title" v-show="editMode" id="addNewLabel">Update User Info</h5>

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <!-- start modal  -->
                        <form @submit.prevent="editMode ? updateUser() : createUsers()">
                        <div class="modal-body">
                             <div class="form-group">
                                <input v-model="form.name" type="text" name="name"
                                    placeholder="Name"
                                    class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>

                             <div class="form-group">
                                <input v-model="form.email" type="email" name="email"
                                    placeholder="Email Address"
                                    class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>

                             <div class="form-group">
                                <textarea v-model="form.bio" name="bio" id="bio"
                                placeholder="Short bio for user (Optional)"
                                class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                                <has-error :form="form" field="bio"></has-error>
                            </div>


                            <div class="form-group">
                                <select name="type" v-model="form.type" id="type" class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                                    <option value="">Select User Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">Standard User</option>
                                    <option value="author">Author</option>
                                </select>
                                <has-error :form="form" field="type"></has-error>
                            </div>

                            <div class="form-group">
                                <input v-model="form.password" type="password" name="password" id="password" class="form-control" :class="{ 'is-invalid': form.errors.has('password') }" placeholder="password">
                                <has-error :form="form" field="password"></has-error>
                            </div>

                        </div>
                        <!-- end modal  -->
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>

                            <button type="submit" v-show="!editMode" class="btn btn-primary">Create</button>

                            <button type="submit" v-show="editMode" class="btn btn-success">Update</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
    </div>


</template>

<script>
    export default {
        data() {
            return {
                editMode:false,
                users: {},
                form: new Form({
                    id: '',
                    name : '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: ''
                })
            }
        },
        methods:{
            newModal(){
                this.editMode = false;
                this.form.reset();
                $('#addNew').modal('show')
            },
            createUsers(){
                this.$Progress.start();
                this.form.post('api/user')
                .then( () => {
                    Fire.$emit('after-created');
                    this.form.reset();
                    $('#addNew').modal('hide')
                    toast.fire({
                      type: 'success',
                      title: 'User Added successfully'
                    })
                    this.$Progress.finish()
                }).catch(() => {
                    this.$Progress.fail();
                })


            },
            loadUsers(){
                if(this.$gate.isAdmin()){
                    axios.get('api/user').then(({ data }) => (this.users = data) );
                }
            },
            editModel(user){
                this.editMode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(user);
            },
            deleteUser(id){
                swal.fire({
                  title: 'Are you sure?',
                  text: "You won't be able to revert this!",
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                  if (result.value) {
                    this.form.delete('api/user/'+id).then(()=>{
                    swal.fire(
                      'Deleted!',
                      'Your file has been deleted.',
                      'success'
                    )
                    Fire.$emit('after-created');
                    }).catch(()=> {
                        swal.fire("Failed!", "There was something wronge.", "warning");
                    });

                   }
                })
            },
            updateUser()
            {
                this.$Progress.start();
                this.form.put('api/user/'+this.form.id)
                .then( () => {
                    Fire.$emit('after-created');
                    this.form.reset();
                    $('#addNew').modal('hide')
                    toast.fire({
                      type: 'success',
                      title: 'User Updated successfully'
                    })
                    this.$Progress.finish()
                })
                .catch(() => {
                    this.$Progress.fail();
                })
            },
            getResults(page = 1) {
                axios.get('api/user?page=' + page)
                    .then(response => {
                        this.users = response.data;
                    });
                },

        },
        created() {
            Fire.$on('searching',() => {
                let query = this.$parent.search;
                axios.get('api/findUser?q=' + query)
                .then((data) => {
                    this.users = data.data
                })
                .catch(() => {
                })
            })
            this.loadUsers();
            Fire.$on('after-created',() => {
                this.loadUsers();
            });
        }
    };
</script>
