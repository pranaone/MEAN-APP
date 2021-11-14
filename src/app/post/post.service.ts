import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from 'rxjs';
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>();

    constructor(private httpClient: HttpClient, private router: Router){}

    getPosts() {
        this.httpClient.get<{message: string, posts: any}>("http://localhost:3000/api/posts")
        .pipe(map((postData)=>{
            return postData.posts.map((post: { title: any; content: any; _id: any; }) => {
                return{
                    title: post.title,
                    content: post.content,
                    id: post._id
                };
            });
        }))
        .subscribe((transformedPosts) => {
            this.posts = transformedPosts;
            this.postUpdated.next([...this.posts]);
        });
    }
    getPost(id: string){
        return this.httpClient.get<{_id: string; title: string; content: string}>
        ("http://localhost:3000/api/posts/"+ id);
    }

    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }

    addPost(title: string, content: string){
        const post: Post = {id: '', title: title, content: content};
        this.httpClient.post<{message: string, postId: string}>("http://localhost:3000/api/posts", post)
        .subscribe((responseData)=>{
            const id = responseData.postId;
            post.id = id;
            this.posts.push(post);
            this.postUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        });  
    }

    updatePost(id: string, title: string, content: string){
        const post: Post = {id: id, title: title, content: content };
        this.httpClient.put("http://localhost:3000/api/posts/"+ id, post)
        .subscribe(response=> {
            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p=>p.id === post.id);
            updatedPosts[oldPostIndex]=post;
            this.posts = updatedPosts;
            this.postUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        });
    }

    deletePost(postId: string){
        this.httpClient.delete("http://localhost:3000/api/posts/"+ postId)
        .subscribe(()=>{
            const updatedPosts = this.posts.filter(post => post.id!==postId);
            this.posts = updatedPosts;
            this.postUpdated.next([...this.posts])
        });
    }
}