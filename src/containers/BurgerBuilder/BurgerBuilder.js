import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';         

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component{
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchaging: false,  // will true once we click on ORDER NOW button. 
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://myburgerbuilder-feceb.firebaseio.com/ingredients.json')
            .then(response =>{
                this.setState({ingredients: response.data});
            }).catch(error =>{
                this.setState({error: true})
            });
    }

    updatePurchaseState (ingredients) {  
        const sum = Object.keys(ingredients)
            .map(igkey => {
                return ingredients[igkey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    purchageHandler = () => {
        this.setState({purchaging: true});
    }

    purchageCancelHandler = () => {
        this.setState({purchaging: false});
    }

    purchageContinueHandler = () =>{
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Sanjeev',
                address: {
                    country: 'India',
                    city: 'Delhi',
                    zipcode: '110091'
                },
                email: 'test@test.com'               
            },
            deliveryMethod: 'fastest'  
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: true, purchaging: false});
            })
            .catch(error => {
                this.setState({loading: true, purchaging: false});
            })
        //alert('You Continue!');
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        // disabledInfo will be like: {salad: true, meat: false, ...}
        let orderSummary = null;     

        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
        
        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                        <BuildControls 
                            ingredientAdded={this.addIngredientHandler}
                            ingredientRemoved={this.removeIngredientHandler}
                            disabled={disabledInfo}
                            purchasable={this.state.purchasable}
                            ordered={this.purchageHandler}
                            price={this.state.totalPrice}/>
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                purchageCancelled={this.purchageCancelHandler}
                purchageContinued={this.purchageContinueHandler}
                price={this.state.totalPrice}/>
        }
         
        if(this.state.loading){
            orderSummary = <Spinner />
        }

        return(
            <Aux>
                <Modal show={this.state.purchaging} modalClosed={this.purchageCancelHandler}>
                    {orderSummary}
                </Modal>    
                {burger}            
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios);