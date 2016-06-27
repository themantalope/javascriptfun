"use strict";
/**
 * This is the class which holds on to the multi layer network, and will have some extra functionality for creating
 * new subgraphs based on other data from either the node or link data.
 */

let _nodes = new WeakMap();
let _matricies = new WeakMap();
let _max_group_depth = new WeakMap();
let _global_node_structure = new WeakMap();


export class MultiGraph {
    /*
    *
    * The constructor for this class takes two arguments, one is a list of nodes, and the other is a list of matricies.
    * The nodes can have any data associated with them but they should have an "index" variable associated with them
    * that corresponds to the row/col position. The list of matricies represents the adjacency matricies associated with
    * the multilayer network. The number of rows and columns of the matricies must be equal to the number of nodes in
    * the node list
    * @param {nodes} - The list of nodes associated with the matrix. Suggested that they have an "index" variable
    * associated with each node that corresponds to its row/col position in the adjacency matricies. If no "index"
    * variable is found, one will be assumed in the order in which the node was encountered. However if the ordering
    * of nodes in the matrix rows/columns is not the same as the ordering delivered in the list, then the links
    * represented by the matrix will be incorrect.
    *
    * Additionally, if nodes are found in some hierarchy, then they can have an additional key called "group". Each
    * "group" can have multiple features associated with it, but if it has a subgroup, then it must have another "group"
    * key.
    *
    * @param {matricies} - A list of adjacency matricies that describe the multilayer network for the list of nodes.
    * The number of rows and columns in each matrix must be the same as the number of nodes.
    * */

    constructor(nodes, matricies){


        var nodedata = this._processNodes(nodes);
        var tnodes = nodedata.nodes;
        var max_depth = nodedata.max_depth;
        var global_struc = nodedata.structure;

        var tmatricies = [];
        //do some error checking before we add any matricies.
        for(var i = 0; i < matricies.length; i++){
            var curmat = matricies[i];
            var matsize = curmat.length;

            if (matsize != tnodes.length){
                throw "The number of nodes must be the same as the number of rows and columns in the matricies!"
            }

            for (var j=0; j < curmat.length; j++){
                if (curmat[j].length != tnodes.length) {
                    throw "The number of nodes must be the same as the number of rows and columns in the matricies!"
                }
            }
            tmatricies.push(curmat)

        }


        // bind the data to the weak maps
        _nodes.bind(this, tnodes);
        _matricies.bind(this, tmatricies);
        _max_group_depth.bind(this, max_depth);
        _global_node_structure.bind(this, global_struc);

    }
    /*
    *
    * Returns the nodes associated with an instance of the object.
    *
    * */
    getNodes(){
        return _nodes.get(this);
    }

    /*
    * This is a private function which processes the input node list. Will automatically add an "index" to the node if
    * it does not exist (will add in the order in which the node appeared).
    * @param {nodes} - The node list to process.
    * */
    _processNodes(nodes){
        var tnodes = [];
        //add the nodes to the object's node array
        for (var i = 0; i < nodes.length; i++){
            var curnode = nodes[i];
            if ("index" in curnode){
                tnodes.push(curnode);
            } else {
                curnode["index"] = i;
                tnodes.push(curnode)
            }
        }

        //sort the node list based on the index values
        tnodes.sort(function(first, second){
            return second.index - first.index;
        });

        //check the depth of "group" within the nodes

        var node_struc_data = this._determineGlobalNodeStructure(nodes);


        return {"nodes":tnodes, "max_depth":node_struc_data.max_depth, "structure":node_struc_data.structure};
    }
    /*
    * This function determines the ultimate hierarchy of the nodes, based on what is in the group.
    * @param {nodes} - node list to determine group structure for.
    * @param {identifer} - this should be some sort of identifier that allows for a label to be had, should be present
    * within the node "group" structure
    * */
    _determineGlobalNodeStructure(nodes, identifier){

        var structure = {"level":0, "groups":{}};
        var max_depth = 0;

        for (i = 0; i < nodes.length; i++){
            var obj = nodes[i];
            var curdepth = 0;
            var curstructure = structure;

            while("group" in obj){

                if (curstructure.level == curdepth){

                    if (!(obj.group[identifier] in curstructure.groups)) {
                        curstructure.groups[obj.group[identifier]] = {"level":curdepth+1, "groups":{}};
                    }

                }

                obj = obj.group;
                curstructure = curstructure.groups[obj.group[identifier]];
                curdepth++;
                if (curdepth > max_depth){
                    max_depth = curdepth;
                }

            }

        }

        return {"structure":structure, "max_depth":max_depth};

    }

    /*
    *
    * This function will return a list of links based on the matrix index. The list will be formatted such that each
    * entry will be of the form {"source":, "target":}, which is compatible with the D3 plotting library.
    *
    * @param {matrix_index} - the index of the matrix for which the link list is to be generated.
    * */
    getLinkListForMatrix(matrix_index){
        var allmats = _matricies.get(this);
        var curmat = allmats[matrix_index];
        var link_list = [];

        for (var i = 0; i < curmat.length; i++){
            for (var j = i; j < curmat[i].length; j++){
                if (curmat[i][j] == 1){
                    link_list.push({"source":i, "target":j})
                }
            }
        }

        return link_list;
    }

}

module.export = MultiGraph;