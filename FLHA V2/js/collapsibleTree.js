class Tree{
    static roots = []
    // #branches;
    #content;
    #parent;
    constructor(parent = null){
        this.branches = [];
        this.#content = null;
        this.#parent = parent;
        if (parent == null){
            Tree.roots.push(this);
        }
    }
    static getRoots(){
        return Tree.roots;
    }
    static removeLast(){
        if (Tree.roots.length > 0){
            return Tree.roots.pop();
        } else {
            throw new Error('No root nodes remaining');
        }
    }

    isLeaf(){
        if(this.branches.length > 0){
            return true;
        } else {
            return false;
        }
    }
    isRoot(){
        if(this.#parent == null){
            return true;
        } else {
            return false;
        }
    }
    
    // Getters and Setters
    getParent(){
        return this.#parent;
    }
    addBranch(){
        const branch = new Tree(this);
        this.branches.push(branch);
        return branch;
    }
    getBranches(){
        return this.branches;
    }
    removeBranch(branch){
        const index = this.branches.indexOf(branch);
    }
    removeLast(suppress = false){
        if (this.branches.length > 0){
            return this.branches.pop();
        } else if (!suppress){
            throw new Error('No branch nodes remaining');
        }
    }
    trimEmptyBranch(){
        for(let i=0; i<this.branches.length; i++){
            const branch = this.branches[i];
            if(branch.getContent() == null){
                this.removeBranch(branch);
            }
        }
    }
    setContent(content){
        this.#content = content;
    }
    getContent(){
        return this.#content;
    }
    
}

