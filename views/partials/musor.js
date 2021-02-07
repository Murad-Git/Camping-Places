<!--COMMENT SECTION START-->
<div class="well">
<!--Setting up the add new comment button that is used for collapsing-->
<div class="text-right">
    <a class="btn btn-success pull-right" role="button" data-toggle="collapse" href="#collapseComment" aria-expanded="false" aria-controls="collapseComment">
    <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add new comment</a>
</div>

<!--Comment section title-->
<h4><strong>Comments <span class="glyphicon glyphicon glyphicon-comment" aria-hidden="true"></span></strong></h4>

<!--Collapse Add a comment form START-->
<div class="collapse" id="collapseComment">
<div class="well" style="border-left: 5px solid #00C851;">
    <% if(!currentUser) { %>
  <!--If the user is not logged in, direct him to the login page-->
  <h5>You need to login before you can comment. <a href="/login">Click here</a> to go to the login page.</h5>
    <% } %>
    <% if(currentUser) { %>
  <!--If the user is logged in, show the new comment form-->
  <h4>Write your comment <span class="glyphicon glyphicon glyphicon-pencil" aria-hidden="true"></span></h4>
  <form id="add-comment-form" action="/campgrounds/<%= campgrounds._id %>/comments" method="POST">
    <div class="form-group">
      <input class="form-control" type="text" disabled value="<%= currentUser.username %>">
    </div>
    <div class="form-group">
      <textarea class="form-control" name="comment[text]" placeholder="Write your comment..." form="add-comment-form" rows="5" cols="70"></textarea>
    </div>
    <div class="form-group">
      <button class="btn btn-success btn-sm">Comment <span class="glyphicon glyphicon-comment" aria-hidden="true"></span></button>
    </div>
  </form>
    <% } %>
</div>
</div>
<!--Collapse Add a comment form END-->

<hr>

<!--Check if there are comments, if there are none say no comments.-->
<% if (campgrounds.comments.length === 0) { %>
<em style="color: grey;">No comments yet.</em>
<% } %>
    <!--Display comments by looping through them-->
<% campgrounds.comments.forEach(function(comment) { %>
    <div class="row">
      <div class="col-md-12">
        <strong>
            <% if (currentUser && currentUser._id.equals(comment.author.id)) { %>
          <!--If the current user owns the comment, change the color of the user icon-->
          <span style="color: orange;" class="glyphicon glyphicon-user" aria-hidden="true"></span>
            <% } else { %>
          <!--Else just display it black-->
          <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
            <% } %>
          <!--Print out the author username-->
            <%= comment.author.username %>
        </strong>

    <!--Show when the comment was made-->
  <span class="pull-right"><%= moment(comment.createdAt).fromNow() %></span>
  <!--Printing the comment-->
  <p><%= comment.text %></p>
  <!--If the visitor is logged in and the owner of the comment, show the edit and delete buttons-->
    <% if (currentUser && currentUser._id.equals(comment.author.id)) { %>
  <!--Edit button used for collapsing the edit comment form-->
  <a class="btn btn-xs btn-warning" role="button" data-toggle="collapse" href="#collapseEdit<%= comment._id %>" aria-expanded="false" aria-controls="collapse<%= comment._id %>">
    Edit</a>

    <!--Delete comment button-->
  <form id="delete-form" action="/campgrounds/<%= campgrounds._id %>/comments/<%= comment._id %>?_method=DELETE" method="POST" style="display: inline;">
    <button class="btn btn-xs btn-danger">Delete</button>
  </form>
  <!--Edit comment form-->
  <div class="collapse" id="collapseEdit<%= comment._id %>">
    <div class="well" style="border-left: 5px solid #ffbb33; margin-top: 15px;">
      <h4>Edit your comment <span class="glyphicon glyphicon-edit" aria-hidden="true"></span></h4>
      <form id="edit-comment-form<%= comment._id %>" action="/campgrounds/<%= campgrounds._id %>/comments/<%= comment._id %>?_method=PUT" method="POST">
        <div class="form-group">
          <input class="form-control" type="text" disabled value="<%= currentUser.username %>">
        </div>
        <div class="form-group">
          <textarea class="form-control" name="comment[text]" placeholder="Your comment text..." form="edit-comment-form<%= comment._id %>" rows="5" cols="70"><%= comment.text %></textarea>
        </div>
        <div class="form-group">
          <button class="btn btn-warning btn-sm">Edit comment <span class="glyphicon glyphicon-comment" aria-hidden="true"></span></button>
        </div>
      </form>
    </div>
  </div>
    <% } %>
  <hr>
</div>
</div>
<% }) %>
</div>
</div>
</div>
<!--COMMENT SECTION END-->