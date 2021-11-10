import { Component, OnDestroy, OnInit} from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  constructor(public postService: PostService) { }

  posts: Post[] = [];

  private postSub: Subscription = new Subscription;
  
  ngOnInit(): void {
    this.postService.getPosts();
    this.postService.getPostUpdateListener()
    .subscribe((posts: Post[])=>{
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

}
